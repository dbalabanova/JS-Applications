function result() {
    class Post {
        constructor(title,content){
            this.title = title,
            this.content=content
        }

        toString(){
            return `Post: ${this.title}\nContent: ${this.content}`
        }
    }

    class SocialMediaPost extends Post {
        constructor(title,content,likes,dislikes) {
            super(title,content),
            this.likes = Number(likes),
            this.dislikes = Number(dislikes),
            this.comments = []
        }

        addComment(comment){
            this.comments.push(comment)
        }
         toString() {
             let output=`${super.toString()}\nRating: ${this.likes-this.dislikes}`
             
             if(this.comments.length!==0){
                 output+=`\nComments:\n${this.comments.map(c=> ` * ${c}`).join('\n')}`
            
             }
             return output
         }
    }

    class BlogPost extends Post{
        constructor(title, content,views){
            super(title,content),
            this.views=views
        }

        view(){
            this.views++
           return this
        }
        toString(){
            return `${super.toString()}\nViews: ${this.views}`
        }
    }

    return{
        Post,
        SocialMediaPost,
        BlogPost
    }
}
// let post = new Post("TestTitle", "TestContent");

// console.log(post.toString());

// // Post: Post
// // Content: Content

// let scm = new SocialMediaPost("TestTitle", "TestContent", 25, 30);

// scm.addComment("Good post");
// scm.addComment("Very good post");
// scm.addComment("Wow!");

// console.log(scm.toString());

// Post: TestTitle
// Content: TestContent
// Rating: -5
// Comments:
//  * Good post
//  * Very good post
//  * Wow!

let classes = result();

let test = new classes.SocialMediaPost("TestTitle", "TestContent", 5, 10);

test.addComment("1");
test.addComment("2");
test.addComment("3");
console.log(test.toString());

