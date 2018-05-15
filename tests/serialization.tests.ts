import {assert, expect} from 'chai';
import {postFactory} from "./stubs";
import {converter} from "../src";

describe('Serialization', function() {

    const simplePost = postFactory(
        post => {
            post.title = "Simple post title";
            post.content = "This is will be ignored on serialization";
        }
    );
    const complexPost = postFactory(
        post => {
            post.title = "Complex post title";
            post.content = "This is will be ignored on serialization";
            post.createdDate = new Date(2009, 5, 12, 11, 22, 44);
        },
        user => {
            user.id = 5;
            user.name = 'Alex'
        }
    );

    it('Serialize single model', () => {
        const result = converter.serialize(simplePost);

        expect(result).haveOwnProperty('Title').equal("Simple post title");
        expect(result).not.haveOwnProperty('content');
        expect(result).not.haveOwnProperty('user');
        expect(result).not.haveOwnProperty('comments');
    });



    it('Serialize complex model', () => {
        const result = converter.serialize(complexPost);

        console.log(result);
        expect(result.author).haveOwnProperty('id').equal(5);
    })

});