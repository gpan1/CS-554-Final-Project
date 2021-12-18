const dbConnection = require("../config/mongoConnection");
const posts = require("../data/posts");

async function main() {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();
    
    const p1 = await posts.create({
        posterName: 'J',
        title: 'Babbio',
        content: 'Building mainly used for business tech classes, also hosts LANs',
        date: new Date(),
        location: [0,1],
        tags: ['Building']
    });
    console.log(p1);
    const p2 = await posts.create({
        posterName: 'J',
        title: 'Muteki Ramen',
        content: 'Ramen place opened in 20xx.',
        date: new Date(),
        location: [1,1],
        tags: ['Eating Spot']
    });
    console.log(p2);
    const p3 = await posts.create({
        posterName: 'J',
        title: 'Howe Tall',
        content: 'How tall is Howe?',
        date: new Date(),
        location: [0,0],
        tags: ['Building']
    });
    console.log(p3);
    const c1 = await posts.addComment({
        postId: p1._id,
        posterName: 'Hill',
        content: 'great place!',
        date: new Date(),
        rating: 4.5
    });
    const c2 = await posts.addComment({
        postId: p3._id,
        posterName: 'Hill',
        content: 'I dont know but its pretty tall',
        date: new Date(),
        rating: 4.5
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