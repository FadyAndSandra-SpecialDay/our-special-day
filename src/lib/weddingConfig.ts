// Wedding Configuration - Edit these values to customize your invitation
export const weddingConfig = {
  // Couple names (display order: Fady & Sandra)
  bride: "Fady",
  groom: "Sandra",
  
  // Wedding date and time (ISO format)
  weddingDate: "2026-02-14T16:00:00",
  
  // Church ceremony
  church: {
    name: "Saint Mary & Saint Athanasius Church",
    time: "1:00 PM",
    mapUrl: "https://maps.app.goo.gl/wWpfGCFeS8y4GNjM7",
  },
  
  // Reception venue
  venue: {
    name: "Pyramids Park Resort Hotel",
    time: "6:00 PM",
    mapUrl: "https://maps.app.goo.gl/7To8pJm5SGV2ey7t7",
  },
  
  // Schedule
  schedule: [
    { time: "1:00 PM", event: "Church Ceremony", location: "Saint Mary & Saint Athanasius Church" },
    { time: "6:00 PM", event: "Reception & Dinner", location: "Pyramids Park Resort Hotel" },
    { time: "9:00 PM", event: "Dancing & Celebration", location: "Pyramids Park Resort Hotel" },
  ],
  
  // Google Sheet ID for guest list
  guestSheetId: "13o9Y6YLPMtz-YFREYNu1L4o4dYrj3Dr-V3C_UstGeMs",
  
  // Google Drive folder for guest uploads
  uploadFolderId: "1uTizlj_-8c6KqODuWcIr8N4VscIwYJJL",

  // Google Drive folder for gallery images
  galleryFolderId: "1l4IlQOJ5z7tA-Nn3_T3zsJHVAzPRrE2D",

  // Background music - AUTO-DETECTED from public/music/ folder
  // 
  // 🎵 AUTOMATIC SETUP:
  // 1. Add MP3 files to public/music/ folder
  // 2. Run: npm run generate-music (or it runs automatically on build)
  // 3. All MP3 files will be automatically included!
  //
  // The music list is auto-generated from public/music/ folder
  // No need to manually update this config when adding new songs!
  //
  backgroundMusicUrl: [] as string[] | string, // Will be populated automatically
  
  // Shuffle playlist: true = random order, false = play in order
  backgroundMusicShuffle: true,
  
  // Background music type: "audio" for direct audio files, "anghami" for Anghami (slow!)
  backgroundMusicType: "audio" as "audio" | "anghami",

  // Bible verse
  bibleVerse: {
    text: "So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
    reference: "Matthew 19:6 NIV",
  },
  
  // Messages
  messages: {
    hero: "Together with their families",
    invitation: "Request the pleasure of your company at the celebration of their marriage",
    closing: "We can't wait to celebrate with you!",
  },
};
