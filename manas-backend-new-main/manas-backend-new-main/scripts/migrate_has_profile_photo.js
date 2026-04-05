const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User } = require('../src/models/User'); // Adjust path as needed

dotenv.config();

const migrate = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users. Starting migration...`);

        let updatedCount = 0;
        for (const user of users) {
            const hasPhoto = !!(user.profile_photo && user.profile_photo.trim().length > 0);

            // Only update if the value is different (though usually it's undefined initially)
            if (user.has_profile_photo !== hasPhoto) {
                user.has_profile_photo = hasPhoto;
                await user.save();
                updatedCount++;
                process.stdout.write(`\rUpdated ${updatedCount} users...`);
            }
        }

        console.log(`\nMigration complete. Updated ${updatedCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
