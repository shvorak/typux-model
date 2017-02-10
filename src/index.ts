import {Default, ListOf, TypeOf} from "./attrs";
import {Binder} from "./binder";
export * from './attrs';
export * from './binder';

class Comment
{

    @TypeOf(Number)
    public id : number;

    @Default('Empty')
    public text : string;

}

class Profile
{

    @TypeOf(Number)
    public id : number;

    @TypeOf(Boolean)
    public deleted : boolean;

    @ListOf(Comment)
    public comments : Comment[];

}


const binder = new Binder();

const profile = binder.bind(Profile, {
    id : '1',
    deleted : 0,
    comments : [
        {
            'id' : '2'
        }
    ]
});

console.log(profile);