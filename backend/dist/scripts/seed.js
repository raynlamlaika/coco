"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Match_1 = __importDefault(require("../models/Match"));
const Trip_1 = __importDefault(require("../models/Trip"));
const Message_1 = __importDefault(require("../models/Message"));
// Load environment variables
dotenv_1.default.config();
// Sample data for seeding
const teams = [
    'Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester City',
    'Tottenham', 'Newcastle', 'West Ham', 'Aston Villa', 'Brighton'
];
const cities = [
    'London', 'Manchester', 'Liverpool', 'Birmingham', 'Leeds',
    'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Southampton'
];
const regions = [
    'North West', 'North East', 'South East', 'South West', 'Midlands',
    'East Anglia', 'Yorkshire', 'London', 'Scotland', 'Wales'
];
const supporterGroups = [
    'Red Army', 'Kop End', 'Gooners', 'Blues Brigade', 'Citizens United',
    'Spurs Faithful', 'Toon Army', 'Hammers United', 'Villa Park Crew', 'Seagulls'
];
const interests = [
    'Football', 'Music', 'Movies', 'Gaming', 'Travel',
    'Food', 'Photography', 'Reading', 'Fitness', 'Art'
];
const stadiums = [
    'Old Trafford', 'Anfield', 'Emirates Stadium', 'Stamford Bridge', 'Etihad Stadium',
    'Tottenham Hotspur Stadium', 'St James Park', 'London Stadium', 'Villa Park', 'Amex Stadium'
];
const competitions = [
    'Premier League', 'FA Cup', 'League Cup', 'Champions League', 'Europa League'
];
const carMakes = ['Toyota', 'Honda', 'Ford', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Nissan'];
const carModels = ['Corolla', 'Civic', 'Focus', 'Golf', 'X5', 'E-Class', 'A4', 'Altima'];
const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green'];
/**
 * Get random item from array
 */
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
/**
 * Get random items from array
 */
const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
/**
 * Generate random phone number
 */
const generatePhone = () => {
    return `+44 7${Math.floor(100000000 + Math.random() * 900000000)}`;
};
/**
 * Generate random plate number
 */
const generatePlateNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return `${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${Math.floor(10 + Math.random() * 90)} ${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}`;
};
/**
 * Seed the database
 */
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/supporter-carpool';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await Promise.all([
            User_1.default.deleteMany({}),
            Match_1.default.deleteMany({}),
            Trip_1.default.deleteMany({}),
            Message_1.default.deleteMany({})
        ]);
        // Create admin users (5)
        console.log('👤 Creating admin users...');
        const adminUsers = [];
        for (let i = 1; i <= 5; i++) {
            const admin = new User_1.default({
                fullName: `Admin User ${i}`,
                email: `admin${i}@example.com`,
                phone: generatePhone(),
                password: await bcryptjs_1.default.hash('admin123', 10),
                city: getRandomItem(cities),
                region: getRandomItem(regions),
                favouriteTeam: getRandomItem(teams),
                supporterGroup: getRandomItem(supporterGroups),
                isDriver: true,
                maxSeats: Math.floor(Math.random() * 4) + 2,
                entryCenter: getRandomItem(stadiums),
                interests: getRandomItems(interests, Math.floor(Math.random() * 5) + 2),
                profilePicture: '',
                role: 'admin',
                isBanned: false
            });
            await admin.save();
            adminUsers.push(admin);
        }
        console.log(`   Created ${adminUsers.length} admin users`);
        // Create regular users (20)
        console.log('👥 Creating regular users...');
        const regularUsers = [];
        for (let i = 1; i <= 20; i++) {
            const isDriver = Math.random() > 0.4; // 60% are drivers
            const user = new User_1.default({
                fullName: `User ${i} Test`,
                email: `user${i}@example.com`,
                phone: generatePhone(),
                password: await bcryptjs_1.default.hash('user123', 10),
                city: getRandomItem(cities),
                region: getRandomItem(regions),
                favouriteTeam: getRandomItem(teams),
                supporterGroup: getRandomItem(supporterGroups),
                isDriver,
                maxSeats: isDriver ? Math.floor(Math.random() * 4) + 2 : 0,
                entryCenter: getRandomItem(stadiums),
                interests: getRandomItems(interests, Math.floor(Math.random() * 5) + 2),
                profilePicture: '',
                role: 'user',
                isBanned: false
            });
            await user.save();
            regularUsers.push(user);
        }
        console.log(`   Created ${regularUsers.length} regular users`);
        // Create matches (10 upcoming)
        console.log('⚽ Creating matches...');
        const matches = [];
        const now = new Date();
        for (let i = 0; i < 10; i++) {
            const homeTeam = getRandomItem(teams);
            let awayTeam = getRandomItem(teams);
            while (awayTeam === homeTeam) {
                awayTeam = getRandomItem(teams);
            }
            // Create match date in the next 30 days
            const matchDate = new Date(now);
            matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * 30) + 1);
            matchDate.setHours(Math.floor(Math.random() * 6) + 12, 0, 0, 0); // 12:00 - 18:00
            const match = new Match_1.default({
                homeTeam,
                awayTeam,
                stadium: getRandomItem(stadiums),
                matchDate,
                competition: getRandomItem(competitions),
                entryCenter: getRandomItem(stadiums),
                isUpcoming: true
            });
            await match.save();
            matches.push(match);
        }
        console.log(`   Created ${matches.length} matches`);
        // Create trips (15)
        console.log('🚗 Creating trips...');
        const allDrivers = [...adminUsers, ...regularUsers.filter(u => u.isDriver)];
        const trips = [];
        const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        for (let i = 0; i < 15; i++) {
            const driver = getRandomItem(allDrivers);
            const match = getRandomItem(matches);
            const departureTime = new Date(match.matchDate);
            departureTime.setHours(departureTime.getHours() - Math.floor(Math.random() * 4) - 2); // 2-6 hours before match
            const trip = new Trip_1.default({
                driver: driver._id,
                match: match._id,
                departureLocation: driver.city,
                departureTime,
                availableSeats: Math.floor(Math.random() * 4) + 1,
                passengers: [],
                requests: [],
                messages: [],
                status: getRandomItem(statuses.slice(0, 3)), // Exclude cancelled for most
                vehicleInfo: {
                    make: getRandomItem(carMakes),
                    model: getRandomItem(carModels),
                    color: getRandomItem(colors),
                    plateNumber: generatePlateNumber()
                },
                preferences: {
                    smoking: Math.random() > 0.8,
                    music: Math.random() > 0.3,
                    conversation: Math.random() > 0.2
                },
                groupingScore: 0,
                isGrouped: false,
                groupedWith: []
            });
            // Add some passengers and requests to confirmed trips
            if (trip.status === 'confirmed' || trip.status === 'completed') {
                const potentialPassengers = regularUsers.filter(u => u._id.toString() !== driver._id.toString());
                const numPassengers = Math.min(Math.floor(Math.random() * 3), trip.availableSeats);
                const passengers = getRandomItems(potentialPassengers, numPassengers);
                trip.passengers = passengers.map(p => p._id);
                trip.availableSeats -= numPassengers;
            }
            // Add pending requests
            if (trip.availableSeats > 0 && Math.random() > 0.5) {
                const potentialRequesters = regularUsers.filter(u => u._id.toString() !== driver._id.toString() &&
                    !trip.passengers.some(p => p.toString() === u._id.toString()));
                const requesters = getRandomItems(potentialRequesters, Math.floor(Math.random() * 2) + 1);
                trip.requests = requesters.map(r => ({
                    user: r._id,
                    status: 'pending',
                    requestedAt: new Date()
                }));
            }
            await trip.save();
            trips.push(trip);
        }
        console.log(`   Created ${trips.length} trips`);
        // Create some messages
        console.log('💬 Creating messages...');
        let messageCount = 0;
        for (const trip of trips.filter(t => t.passengers.length > 0)) {
            const driver = allDrivers.find(d => d._id.toString() === trip.driver.toString());
            if (!driver)
                continue;
            // Driver welcome message
            const welcomeMsg = new Message_1.default({
                trip: trip._id,
                sender: driver._id,
                content: `Hi everyone! Looking forward to the trip to ${trip.departureLocation}. See you soon!`,
                timestamp: new Date(),
                read: false
            });
            await welcomeMsg.save();
            trip.messages.push(welcomeMsg._id);
            messageCount++;
            // Passenger replies
            for (const passengerId of trip.passengers.slice(0, 2)) {
                const passenger = regularUsers.find(u => u._id.toString() === passengerId.toString());
                if (!passenger)
                    continue;
                const reply = new Message_1.default({
                    trip: trip._id,
                    sender: passenger._id,
                    content: getRandomItem([
                        'Thanks for the ride! See you there!',
                        'Great, looking forward to it!',
                        'Perfect, thanks for arranging this!',
                        'Awesome, can\'t wait for the match!'
                    ]),
                    timestamp: new Date(),
                    read: false
                });
                await reply.save();
                trip.messages.push(reply._id);
                messageCount++;
            }
            await trip.save();
        }
        console.log(`   Created ${messageCount} messages`);
        console.log('\n✅ Database seeded successfully!');
        console.log('\n📋 Seed Summary:');
        console.log(`   - Admin users: ${adminUsers.length} (password: admin123)`);
        console.log(`   - Regular users: ${regularUsers.length} (password: user123)`);
        console.log(`   - Matches: ${matches.length}`);
        console.log(`   - Trips: ${trips.length}`);
        console.log(`   - Messages: ${messageCount}`);
        console.log('\n📧 Sample login credentials:');
        console.log('   Admin: admin1@example.com / admin123');
        console.log('   User: user1@example.com / user123');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};
// Run the seed script
seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
