# Grumpus

It gets upset if your API data is bad!

## All of the Badges

[![Build Status](https://travis-ci.com/williamareynolds/grumpus.svg?token=4KHz4TKq1ydcqkZZM9YK&branch=master)](https://travis-ci.com/williamareynolds/grumpus)

## Purpose

Testing an API can be an arduous task. You have to check to make sure the API returns
the correct data in the correct format, but you tend to do all this work of checking
without ever being able to use those same structures to produce Typescript types or
generate test data. This small library acts like a helpful bridge between io-ts and
your API. It allows you to assert that the response from an HTTP call matches the
schema provided.

## Installation

npm i grumpus --save

## Basic Usage

This library simply checks an endpoint using the io-ts schema you expect the endpoint
to return. Your schema can be an application dependency if you use your schema at
runtime to produce guards, decoders, JSONEncoders, etc. If you only want to use
your schema for testing and generating test data, you can keep them separate from
your runtime source. Once you have your schema, you can use the `checkEndpoint`
function to test an endpoint with a schema. 

```typescript 
const articleSchema = make(s => s.type({ id: s.number, content: s.string }))
type Article = TypeOf<typeof articleSchema>

const testData: CheckEndpointDeps<Article> = {
  url: 'https://www.yourcoolwebsite.com/api/articles/1',
  expectations: {
    schema: articleSchema,
    status: 200
  }
}
```
