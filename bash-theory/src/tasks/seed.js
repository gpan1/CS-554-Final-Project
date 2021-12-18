const dbConnection = require("../config/mongoConnection");
const posts = require("../data/posts");
const locations = require("../data/locations");

async function main() {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();
    
    // const l1 = await locations.create()
    const p1 = await posts.create({
        posterName: 'J',
        title: 'Babbio big',
        content: 'This building can fit so many gamers in it',
        date: new Date(),
        location: [0,1],
        tags: ['Building'],
        rating: 5
    });
    console.log(p1);
    const p2 = await posts.create({
        posterName: 'J',
        title: 'Muteki Ramen is pretty good',
        content: "That's it, my review is in the title.",
        date: new Date(),
        location: [1,1],
        tags: ['Eating Spot'],
        rating: 4
    });
    console.log(p2);
    const p3 = await posts.create({
        posterName: 'J',
        title: 'Howe Tall',
        content: 'How tall is Howe? Not really a review I know, but just curious.',
        date: new Date(),
        location: [0,0],
        tags: ['Building'],
        rating: 3.5
    });
    console.log(p3);
    const c1 = await posts.addComment({
        postId: p1._id,
        posterName: 'Hill',
        content: 'True that!',
        date: new Date()
    });
    const c2 = await posts.addComment({
        postId: p3._id,
        posterName: 'Hill',
        content: 'I dont know but its pretty tall',
        date: new Date()
    });
    console.log(c1);
    const s1 = await posts.postSearch({
        term:'Ba',
        tags: ['Building','Eating Spot'],
        sort: ['title',1]
    });
    console.log(s1);

    await dbConnection.closeConnection();
    console.log("Done seeding database");
    
    
}

main();