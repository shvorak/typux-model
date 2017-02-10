# typux-http
HTTP plugin for typux


## Installation

```bash
npm install typux-model
```
or
```bash
yarn add typux-model
```

## Usage

### Models

```ts

export class Post
{

    @TypeOf(Number)
    public id : number;
    
    @TypeOf(Boolean)
    public favorite : boolean;
    
    @TypeOf(Date)
    public postedAt : Date; 
    
    @ListOf(Comment)
    public comments : Comment[];
    
}


export class Comment
{
    
    ...
    
}

```

### Convert

```ts
import {Converter} from 'typux-model';

const converter = new Converter();

const post = converter.convertTo(Post, {
    id : '1',
    'favorite' : 0,
    postedAt : '2017-02-11 12:23:32',
    comments : [
        {...},
        {...}
    }
})

```
