const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class OCRService {
  constructor() {
    this.isInitialized = false;
    this.worker = null;
  }

  async initialize() {
    try {
      console.log('🔍 Initializing OCR service...');
      this.worker = await Tesseract.createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      this.isInitialized = true;
      console.log('✅ OCR service initialized');
    } catch (error) {
      console.error('❌ OCR initialization failed:', error);
      this.isInitialized = false;
    }
  }

  async preprocessImage(imagePath) {
    try {
      const processedPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '_processed.png');
      
      await sharp(imagePath)
        .resize(2000, null, { withoutEnlargement: true })
        .normalize()
        .sharpen()
        .png({ quality: 90 })
        .toFile(processedPath);
      
      return processedPath;
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      return imagePath; // Return original if preprocessing fails
    }
  }

  async extractText(imagePath) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const processedPath = await this.preprocessImage(imagePath);
      const { data: { text, confidence } } = await this.worker.recognize(processedPath);
      
      // Clean up processed image
      if (processedPath !== imagePath) {
        await fs.unlink(processedPath).catch(() => {});
      }
      
      return {
        text: text.trim(),
        confidence: confidence,
        success: true
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      return {
        text: '',
        confidence: 0,
        success: false,
        error: error.message
      };
    }
  }

  async validatePAN(imagePath) {
    const ocrResult = await this.extractText(imagePath);
    
    if (!ocrResult.success) {
      return { valid: false, error: 'OCR extraction failed' };
    }

    const text = ocrResult.text.toUpperCase();
    
    // PAN format: ABCDE1234F
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
    const panMatches = text.match(panRegex);
    
    if (!panMatches || panMatches.length === 0) {
      return { 
        valid: false, 
        error: 'No valid PAN number found',
        extractedText: text,
        confidence: ocrResult.confidence
      };
    }

    const panNumber = panMatches[0];
    
    // Additional validation patterns
    const hasIncomeTax = text.includes('INCOME TAX') || text.includes('DEPARTMENT');
    const hasGovernment = text.includes('GOVERNMENT') || text.includes('INDIA');
    
    return {
      valid: true,
      panNumber: panNumber,
      confidence: ocrResult.confidence,
      extractedText: text,
      validationScore: hasIncomeTax && hasGovernment ? 95 : 80
    };
  }

  async validateAadhaar(imagePath) {
    const ocrResult = await this.extractText(imagePath);
    
    if (!ocrResult.success) {
      return { valid: false, error: 'OCR extraction failed' };
    }

    const text = ocrResult.text;
    
    // Aadhaar format: 1234 5678 9012
    const aadhaarRegex = /\d{4}\s\d{4}\s\d{4}/g;
    const aadhaarMatches = text.match(aadhaarRegex);
    
    if (!aadhaarMatches || aadhaarMatches.length === 0) {
      return { 
        valid: false, 
        error: 'No valid Aadhaar number found',
        extractedText: text,
        confidence: ocrResult.confidence
      };
    }

    const aadhaarNumber = aadhaarMatches[0];
    
    // Extract name and other details
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let name = '';
    let dob = '';
    
    // Look for name patterns (usually after "Name:" or similar)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('name') && i + 1 < lines.length) {
        name = lines[i + 1].trim();
        break;
      }
    }
    
    // Look for DOB patterns
    const dobRegex = /(\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4})/g;
    const dobMatch = text.match(dobRegex);
    if (dobMatch) {
      dob = dobMatch[0];
    }

    const hasUID = text.toUpperCase().includes('UNIQUE IDENTIFICATION');
    const hasGovernment = text.toUpperCase().includes('GOVERNMENT') || text.toUpperCase().includes('INDIA');
    
    return {
      valid: true,
      aadhaarNumber: aadhaarNumber,
      name: name,
      dob: dob,
      confidence: ocrResult.confidence,
      extractedText: text,
      validationScore: hasUID && hasGovernment ? 95 : 80
    };
  }

  async validateMarksMemo(imagePath) {
    const ocrResult = await this.extractText(imagePath);
    
    if (!ocrResult.success) {
      return { valid: false, error: 'OCR extraction failed' };
    }

    const text = ocrResult.text.toUpperCase();
    
    // Look for educational institution indicators
    const educationKeywords = [
      'UNIVERSITY', 'COLLEGE', 'INSTITUTE', 'SCHOOL',
      'MARKS', 'GRADE', 'CGPA', 'PERCENTAGE',
      'SEMESTER', 'EXAMINATION', 'RESULT',
      'BACHELOR', 'MASTER', 'DIPLOMA', 'CERTIFICATE'
    ];
    
    const foundKeywords = educationKeywords.filter(keyword => 
      text.includes(keyword)
    );
    
    if (foundKeywords.length < 2) {
      return {
        valid: false,
        error: 'Document does not appear to be a valid marks memo',
        extractedText: text,
        confidence: ocrResult.confidence
      };
    }

    // Extract grades/marks
    const gradeRegex = /(\d+\.?\d*)\s*%|\b([A-F][+-]?)\b|CGPA\s*:?\s*(\d+\.?\d*)/gi;
    const gradeMatches = text.match(gradeRegex) || [];
    
    // Extract student name
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let studentName = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('NAME') && i + 1 < lines.length) {
        studentName = lines[i + 1].trim();
        break;
      }
    }

    return {
      valid: true,
      studentName: studentName,
      grades: gradeMatches,
      foundKeywords: foundKeywords,
      confidence: ocrResult.confidence,
      extractedText: text,
      validationScore: foundKeywords.length >= 4 ? 90 : 75
    };
  }

  async validateDocument(documentType, imagePath) {
    switch (documentType.toLowerCase()) {
      case 'pan':
        return await this.validatePAN(imagePath);
      case 'aadhaar':
        return await this.validateAadhaar(imagePath);
      case 'marksmemo':
        return await this.validateMarksMemo(imagePath);
      default:
        return { valid: false, error: 'Unsupported document type' };
    }
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

const ocrService = new OCRService();

module.exports = { ocrService };