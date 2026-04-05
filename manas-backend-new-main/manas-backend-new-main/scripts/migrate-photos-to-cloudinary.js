/**
 * Migration Script: Migrate Base64 Profile Photos to Cloudinary
 * 
 * Run this script once after deploying the Cloudinary integration
 * to migrate existing base64 photos in the database.
 * 
 * Usage: node scripts/migrate-photos-to-cloudinary.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { User } = require('../src/models/User.js');
const { uploadImage, isBase64DataUrl, isCloudinaryUrl } = require('../src/services/cloudinaryService.js');

const BATCH_SIZE = 10; // Process 10 users at a time to avoid rate limits

async function migrate() {
  console.log('🚀 Starting profile photo migration to Cloudinary...\n');

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }

  // Check Cloudinary config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary environment variables not set!');
    console.log('   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Find all users with base64 photos
  const usersWithBase64Photos = await User.find({
    profile_photo: { $regex: /^data:image/ }
  }).select('_id email profile_photo');

  console.log(`📊 Found ${usersWithBase64Photos.length} users with base64 photos to migrate\n`);

  if (usersWithBase64Photos.length === 0) {
    console.log('✨ No photos to migrate. All done!');
    process.exit(0);
  }

  let successCount = 0;
  let failCount = 0;
  const failures = [];

  // Process in batches
  for (let i = 0; i < usersWithBase64Photos.length; i += BATCH_SIZE) {
    const batch = usersWithBase64Photos.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(usersWithBase64Photos.length / BATCH_SIZE)}...`);

    const promises = batch.map(async (user) => {
      try {
        if (!isBase64DataUrl(user.profile_photo)) {
          return { success: true, skipped: true };
        }

        console.log(`  ⬆️  Uploading photo for user ${user._id}...`);
        
        const result = await uploadImage(
          user.profile_photo,
          'profile_photos',
          `user_${user._id}`
        );

        await User.findByIdAndUpdate(user._id, {
          profile_photo: result.url
        });

        console.log(`  ✅ Migrated: ${user._id} → ${result.url.substring(0, 60)}...`);
        return { success: true };
      } catch (error) {
        console.error(`  ❌ Failed: ${user._id} - ${error.message}`);
        return { success: false, userId: user._id, email: user.email, error: error.message };
      }
    });

    const results = await Promise.all(promises);
    
    results.forEach(result => {
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        failures.push(result);
      }
    });

    // Add a small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < usersWithBase64Photos.length) {
      console.log('  ⏳ Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Complete!\n');
  console.log(`✅ Successfully migrated: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  if (failures.length > 0) {
    console.log('\n⚠️  Failed migrations:');
    failures.forEach(f => {
      console.log(`   - ${f.userId} (${f.email}): ${f.error}`);
    });
  }

  // Disconnect
  await mongoose.disconnect();
  console.log('\n✅ Disconnected from MongoDB');
  process.exit(failures.length > 0 ? 1 : 0);
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
