import fs from 'fs'
import path from 'path'

interface OCRTestResult {
  filename: string
  success: boolean
  processingTime: number
  extractedText: string
  classification: {
    type: string
    category: string
    confidence: number
    summary: string
    keyFields: Record<string, any>
  }
  error?: string
  textLength: number
  wordCount: number
}

/**
 * Automatisierter OCR Test für alle Beispieldokumente
 */
class OCRTester {
  private baseUrl = 'http://localhost:3000'
  private testDocumentsPath = '/Users/natashawehrli/ocr_alpha/test-documents'
  private results: OCRTestResult[] = []

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting automated OCR testing...')
    console.log('📁 Test documents directory:', this.testDocumentsPath)

    const files = fs.readdirSync(this.testDocumentsPath)
    const supportedFiles = files.filter(file => 
      /\.(pdf|png|jpg|jpeg|webp|docx)$/i.test(file)
    )

    console.log(`📋 Found ${supportedFiles.length} supported documents to test`)

    for (const filename of supportedFiles) {
      console.log(`\n🔍 Testing: ${filename}`)
      await this.testDocument(filename)
    }

    this.generateReport()
  }

  async testDocument(filename: string): Promise<void> {
    const startTime = Date.now()
    const filePath = path.join(this.testDocumentsPath, filename)

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      // Read file
      const fileBuffer = fs.readFileSync(filePath)
      const fileSize = fileBuffer.length
      console.log(`  📄 File size: ${(fileSize / 1024).toFixed(1)} KB`)

      // Create FormData
      const formData = new FormData()
      const file = new File([fileBuffer], filename, {
        type: this.getMimeType(filename)
      })
      formData.append('file', file)

      // Send to OCR API
      console.log('  🤖 Sending to OCR API...')
      const response = await fetch(`${this.baseUrl}/api/ocr-debug`, {
        method: 'POST',
        body: formData
      })

      const processingTime = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        const textLength = data.extractedText?.length || 0
        const wordCount = data.extractedText ? data.extractedText.split(/\s+/).length : 0

        this.results.push({
          filename,
          success: true,
          processingTime,
          extractedText: data.extractedText || '',
          classification: data.classification || {
            type: 'Unknown',
            category: 'Unclassified',
            confidence: 0,
            summary: 'No classification',
            keyFields: {}
          },
          textLength,
          wordCount
        })

        console.log(`  ✅ Success! Type: ${data.classification?.type || 'Unknown'}`)
        console.log(`  📊 Confidence: ${((data.classification?.confidence || 0) * 100).toFixed(1)}%`)
        console.log(`  📝 Text: ${textLength} chars, ${wordCount} words`)
        console.log(`  ⏱️  Processing: ${processingTime}ms`)
      } else {
        throw new Error(result.error || 'Unknown OCR error')
      }

    } catch (error) {
      const processingTime = Date.now() - startTime
      
      this.results.push({
        filename,
        success: false,
        processingTime,
        extractedText: '',
        classification: {
          type: 'Error',
          category: 'Failed',
          confidence: 0,
          summary: 'Processing failed',
          keyFields: {}
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: 0,
        wordCount: 0
      })

      console.log(`  ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.log(`  ⏱️  Processing: ${processingTime}ms`)
    }
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
    return mimeTypes[ext] || 'application/octet-stream'
  }

  private generateReport(): void {
    console.log('\n' + '='.repeat(80))
    console.log('📊 OCR TESTING REPORT')
    console.log('='.repeat(80))

    const successful = this.results.filter(r => r.success)
    const failed = this.results.filter(r => !r.success)

    console.log(`\n📈 SUMMARY:`)
    console.log(`  Total documents: ${this.results.length}`)
    console.log(`  Successful: ${successful.length} (${((successful.length / this.results.length) * 100).toFixed(1)}%)`)
    console.log(`  Failed: ${failed.length} (${((failed.length / this.results.length) * 100).toFixed(1)}%)`)

    if (successful.length > 0) {
      const avgProcessingTime = successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length
      const avgConfidence = successful.reduce((sum, r) => sum + r.classification.confidence, 0) / successful.length
      const avgTextLength = successful.reduce((sum, r) => sum + r.textLength, 0) / successful.length

      console.log(`\n⚡ PERFORMANCE:`)
      console.log(`  Average processing time: ${avgProcessingTime.toFixed(0)}ms`)
      console.log(`  Average confidence: ${(avgConfidence * 100).toFixed(1)}%`)
      console.log(`  Average text length: ${avgTextLength.toFixed(0)} characters`)
    }

    // Document type classification
    const typeStats: Record<string, number> = {}
    successful.forEach(r => {
      const type = r.classification.type
      typeStats[type] = (typeStats[type] || 0) + 1
    })

    if (Object.keys(typeStats).length > 0) {
      console.log(`\n📋 DOCUMENT TYPES DETECTED:`)
      Object.entries(typeStats).forEach(([type, count]) => {
        console.log(`  ${type}: ${count} documents`)
      })
    }

    // Detailed results
    console.log(`\n📄 DETAILED RESULTS:`)
    this.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.filename}`)
      if (result.success) {
        console.log(`   ✅ Type: ${result.classification.type}`)
        console.log(`   📊 Confidence: ${(result.classification.confidence * 100).toFixed(1)}%`)
        console.log(`   📝 Text: ${result.textLength} chars, ${result.wordCount} words`)
        console.log(`   ⏱️  Time: ${result.processingTime}ms`)
        if (result.classification.summary) {
          console.log(`   📋 Summary: ${result.classification.summary.substring(0, 100)}...`)
        }
        
        // Show key fields
        const keyFields = Object.keys(result.classification.keyFields)
        if (keyFields.length > 0) {
          console.log(`   🔑 Key fields: ${keyFields.join(', ')}`)
        }
      } else {
        console.log(`   ❌ Error: ${result.error}`)
        console.log(`   ⏱️  Time: ${result.processingTime}ms`)
      }
    })

    // Save detailed report to file
    const reportPath = '/Users/natashawehrli/ocr_alpha/ocr-test-report.json'
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        successful: successful.length,
        failed: failed.length,
        successRate: (successful.length / this.results.length) * 100,
        avgProcessingTime: successful.length > 0 ? successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length : 0,
        avgConfidence: successful.length > 0 ? successful.reduce((sum, r) => sum + r.classification.confidence, 0) / successful.length : 0
      },
      typeStatistics: typeStats,
      detailedResults: this.results
    }, null, 2))

    console.log(`\n💾 Detailed report saved to: ${reportPath}`)
    console.log('='.repeat(80))
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  const tester = new OCRTester()
  tester.runAllTests().catch(console.error)
}

export { OCRTester }