const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    // Find all users who have any accepted interests
    const users = await db.collection('users').find({
        $or: [
            { 'expressed_interests.status': 'accepted' },
            { 'received_interests.status': 'accepted' }
        ]
    }, { projection: { full_name: 1, phone_number: 1, expressed_interests: 1, received_interests: 1 } }).toArray();

    // Build a name lookup map
    const nameMap = {};
    for (const u of users) {
        nameMap[u._id.toString()] = { name: u.full_name, phone: u.phone_number };
    }

    // Dedupe match pairs
    const seen = new Set();
    const allMatches = [];

    for (const user of users) {
        for (const interest of (user.expressed_interests || [])) {
            if (interest.status === 'accepted') {
                const pair = [user._id.toString(), interest.user.toString()].sort().join('-');
                if (!seen.has(pair)) {
                    seen.add(pair);
                    const other = nameMap[interest.user.toString()];
                    allMatches.push({
                        user1: user.full_name,
                        user1Phone: user.phone_number,
                        user2: other ? other.name : interest.user.toString(),
                        user2Phone: other ? other.phone : 'N/A',
                        matchedAt: interest.sentAt
                    });
                }
            }
        }
    }

    console.log('\n=== ALL MATCHES ON THE APP ===\n');
    if (allMatches.length === 0) {
        console.log('No matches found yet.');
    } else {
        allMatches.forEach((m, i) => {
            console.log(`${i + 1}. ${m.user1} (${m.user1Phone}) <-> ${m.user2} (${m.user2Phone})  [${m.matchedAt ? new Date(m.matchedAt).toLocaleDateString() : 'N/A'}]`);
        });
    }
    console.log(`\nTotal matches: ${allMatches.length}`);

    process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
