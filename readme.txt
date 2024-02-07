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
