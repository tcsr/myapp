
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css']
})
export class DocumentManagementComponent implements OnInit {
  personalTermsAndConditionFL: any; // Assuming this is the type of your documents
  personalTermsAndConditionMC: any; // Assuming this is the type of your documents
  languages: any[] = []; // Assuming this is the type of your languages

  constructor() { }

  ngOnInit(): void {
    // Fetch documents and languages from API
    // Replace the following with actual API calls
    this.fetchDocuments();
    this.fetchLanguages();
  }

  fetchDocuments(): void {
    // Replace this with your actual API call to fetch documents
    // For example, you can use this.oldDoc as a mock data for now
    this.oldDoc = [
      // Your document data
    ];

    // Update personalTermsAndConditionFL and personalTermsAndConditionMC
    this.personalTermsAndConditionFL = this.oldDoc.find(doc => doc.documentTypeId === 8 && doc.roleId === 2) || personalTermsAndConditionFL;
    this.personalTermsAndConditionMC = this.oldDoc.find(doc => doc.documentTypeId === 8 && doc.roleId === 15) || personalTermsAndConditionMC;
  }

  fetchLanguages(): void {
    // Replace this with your actual API call to fetch languages
    // For example, you can use this.languages as a mock data for now
    this.languages = [
      // Your language data
    ];

    // Repeat section content and map translations
    this.repeatSectionContentInAllLanguages();
    this.mapTranslations();
  }

  repeatSectionContentInAllLanguages(): void {
    // Repeat section content for all available languages
    [this.personalTermsAndConditionFL, this.personalTermsAndConditionMC].forEach(document => {
      if (document) {
        document.sectionContent.forEach(section => {
          // Create a copy of the section content for each language
          this.languages.forEach(language => {
            const translation = this.getTranslation(section, language.languageISOCode);
            const translatedSection = {
              sectionId: section.sectionId,
              id: section.id + 1000, // Dynamic ID for translated section
              deletedFlag: false,
              sectionContent: translation || ''
            };

            // Add translations array to each section
            section.translations = section.translations || [];
            section.translations.push({
              languageISOCode: language.languageISOCode,
              translationText: translation || '',
              translatedSection: [translatedSection]
            });
          });
        });
      }
    });
  }

  mapTranslations(): void {
    // Map translations from the actual response to each section
    [this.personalTermsAndConditionFL, this.personalTermsAndConditionMC].forEach(document => {
      if (document) {
        document.sectionContent.forEach(section => {
          section.translations.forEach(translation => {
            const languageIndex = this.languages.findIndex(lang => lang.languageISOCode === translation.languageISOCode);
            if (languageIndex !== -1) {
              // Update translationText in the corresponding language
              section.translations[languageIndex].translationText = translation.translationText;

              // Update translatedSection in the corresponding language
              const translatedSection = section.translations[languageIndex].translatedSection[0];
              translatedSection.sectionId = section.sectionId;
              translatedSection.id = section.id + 1000; // Dynamic ID for translated section
              translatedSection.deletedFlag = false;
              translatedSection.sectionContent = translation.translationText;
            }
          });
        });
      }
    });
  }

  getTranslation(section: any, languageISOCode: string): string {
    const translation = section.translations.find(t => t.languageISOCode === languageISOCode);
    return translation ? translation.translationText : '';
  }
}
