import {Action, Func0, Func1, ListOf, TypeOf} from "typux";
import {Alias, DateTime, Ignore} from "../src";

export class User
{

    public id : number;

    public name : string;

}

export class Comment
{

    public author : string;

    public content : string;

}



export class Post
{

    @Alias('Title')
    public title : string;

    @Ignore()
    public content : string;

    @TypeOf(User)
    public author : User;

    @ListOf(Comment)
    public comments : Comment[];

    @DateTime()
    public createdDate : Date;

}


export const postFactory = (postFactory : Action<Post>, userFactory? : Action<User>, commentsFactory? : Func0<Comment[]>) => {
    const post = new Post();
    postFactory(post);

    if (userFactory) {
        post.author = new User();
        userFactory(post.author);
    }

    if (commentsFactory) {
        post.comments = commentsFactory();
    }

    return post;
};

