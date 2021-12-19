const dbConnection = require("../config/mongoConnection");
const posts = require("../data/posts");
const locations = require("../data/locations");

async function main() {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();
    
    const l1 = await locations.create({
        name: "Muteki Ramen",
        location: [0,1],
        tags: ['Eating Spot'],
        description: 'Japanese Ramen shop opened in 20xx.'
    })
    console.log(l1);
    const l2 = await locations.create({
        name: "Babbio",
        location: [1,1],
        tags: ['Building'],
        description: 'Academic building located at the southside of Campus, mainly used for Businees Tech classes.'
    })
    const l3 = await locations.create({
        name: "Howe",
        location: [0,1],
        tags: ['Building'],
        description: 'Administrative building with many offices. Pierce Dining on second floor'
    })
    const p1 = await posts.create({
        posterName: 'J',
        title: 'Babbio big',
        content: 'This building can fit so many gamers in it',
        date: new Date(),
        locationId: l2._id,
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
        locationId: l1._id,
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
        locationId: l3._id,
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