// Your data
const data = [
  {
    "documentTypeId": 8,
    "roleId": 2,
    // ... (rest of your data)
  },
  {
    "documentTypeId": 8,
    "roleId": 15,
    // ... (rest of your data)
  }
];

// List of translation languages
const languages = [
  {
    "languageISOCode": "en",
    "name": "English",
    "isDefault": true,
    "deletedFlag": false,
    "isActive": true,
    "isApplicableForApp": true,
    "canBeActivated": false
  },
  {
    "languageISOCode": "Te",
    "name": "Telugu",
    "isDefault": true,
    "deletedFlag": false,
    "isActive": true,
    "isApplicableForApp": true,
    "canBeActivated": false
  }
];

// Function to map corresponding sections from "translations" array
const mapTranslations = (document) => {
  // Create a map for faster lookups based on sectionId
  const translationsMap = new Map(
    document.translations.flatMap((translation) =>
      translation.translatedSection.map((tSection) => [tSection.sectionId, tSection])
    )
  );

  // Map translations for each section
  document.sectionContent.forEach((section) => {
    const matchingTranslations = translationsMap.get(section.sectionId) || [];

    // Map translations for all available languages
    section.translations = [
      ...matchingTranslations,
      ...languages.map((language) => ({
        languageISOCode: language.languageISOCode,
        translationText: "", // You can set the translation text as needed
        // Other language properties can be added here
      }))
    ];
  });
};

// Function to generate the save API payload for a document
const generateSavePayload = (document) => ({
  documentTypeId: [document.documentTypeId],
  documents: [
    {
      documentContent: document.documentContent,
      sectionContent: document.sectionContent.map((section) => ({
        sectionId: section.sectionId,
        id: section.id,
        deletedFlag: section.deletedFlag,
        sectionContent: section.sectionContent
      })),
      documentTypeId: document.documentTypeId,
      roleId: document.roleId,
      translations: document.translations.map((translation) => ({
        languageISOCode: translation.languageISOCode,
        translationText: translation.translationText,
        translatedSection: translation.translatedSection.map((translatedSection) => ({
          id: translatedSection.id,
          sectionId: translatedSection.sectionId,
          sectionContent: translatedSection.sectionContent,
          deletedFlag: translatedSection.deletedFlag
        })),
        id: translation.id,
        deletedFlag: translation.deletedFlag
      }))
    }
  ]
});

// Loop through each document and call the function to map translations
data.forEach(mapTranslations);

// Generate the save API payload for each document
const savePayload = data.map(generateSavePayload);

// Log the generated save API payload
console.log(JSON.stringify(savePayload, null, 2));
--------------------------------------------------------------------------


// Assuming that the fetchDocuments and saveDocuments methods return Observables
this.legalClauseService.fetchDocuments().subscribe(res => {
  // Predefined objects for document types and roles
  const personalTermsAndConditionFL = {
    documentTypeId: 8,
    roleId: 2,
    documentContent: null,
    sectionContent: null,
    translations: [],
    versionNo: 0
  };
  const personalTermsAndConditionMC = {
    documentTypeId: 8,
    roleId: 15,
    documentContent: null,
    sectionContent: null,
    translations: [],
    versionNo: 0
  };

  // Assign the fetched documents to the oldDoc property
  this.oldDoc = res.documents;

  // Function to map corresponding sections from "translations" array
  const mapTranslations = (document) => {
    const translationsMap = new Map(
      document.translations.flatMap((translation) =>
        translation.translatedSection.map((tSection) => [tSection.sectionId, tSection])
      )
    );

    const apiSectionIds = new Set(
      document.sectionContent.map((section) => section.sectionId)
    );

    document.sectionContent.forEach((section) => {
      const matchingTranslations = translationsMap.get(section.sectionId) || [];

      section.translations = [
        ...matchingTranslations,
        // You can add translations for all available languages here
      ];
    });

    if (apiSectionIds.size === 0) {
      document.sectionContent = [
        ...document.sectionContent,
        // You can add sections with IDs set to null for new sections
      ];
    }
  };

  // Update or initialize the document objects based on document type ID and role ID
  this.personalTermsAndConditionFL = this.oldDoc.find(doc => Number(doc.documentTypeId) === 8 && Number(doc.roleId) === 2) || personalTermsAndConditionFL;
  this.personalTermsAndConditionMC = this.oldDoc.find(doc => Number(doc.documentTypeId) === 8 && Number(doc.roleId) === 15) || personalTermsAndConditionMC;

  // Loop through each document and call the function to map translations
  [this.personalTermsAndConditionFL, this.personalTermsAndConditionMC].forEach(mapTranslations);

  // Function to generate the save API payload for a document
  const generateSavePayload = (document) => ({
    documentTypeId: [document.documentTypeId],
    documents: [
      {
        documentContent: document.documentContent,
        sectionContent: document.sectionContent.map((section) => ({
          sectionId: section.sectionId,
          id: section.id,
          deletedFlag: section.deletedFlag,
          sectionContent: section.sectionContent,
          translations: section.translations,
        })),
        documentTypeId: document.documentTypeId,
        roleId: document.roleId,
        translations: document.translations.map((translation) => ({
          languageISOCode: translation.languageISOCode,
          translationText: translation.translationText,
          translatedSection: translation.translatedSection.map((translatedSection) => ({
            id: translatedSection.id,
            sectionId: translatedSection.sectionId,
            sectionContent: translatedSection.sectionContent,
            deletedFlag: translatedSection.deletedFlag
          })),
          id: translation.id,
          deletedFlag: translation.deletedFlag
        }))
      }
    ]
  });

  // Generate the save API payload for each document
  const savePayload = [this.personalTermsAndConditionFL, this.personalTermsAndConditionMC].map(generateSavePayload);

  // Now, you can use the generated save payload as needed
  console.log(savePayload);

  // Assuming you have a saveDocuments method in your legalClauseService
  this.legalClauseService.saveDocuments(savePayload).subscribe(response => {
    // Handle the save API response as needed
    console.log(response);
  });
});

