# jade-flow
A powerful control flow model described by [jade syntax](https://github.com/jadejs/jade).Inspired by [koa](https://github.com/koajs/koa).

## Control flow in Koa
As we all know in koa, the control flow goes like this:

![](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)

Let's say it looks like a `U` shape as below:

![](https://img.alicdn.com/tps/TB1Bp8WIFXXXXbPXFXXXXXXXXXX.png)

Once the flow reaches the bottom of the middleware stack, it has to go
back along the way it comes.

## What's the difference in jade-flow
It provides much more flexibilities and allows the control flow go like a `W` shape as below:

**pic a:**

![](https://img.alicdn.com/tps/TB1hSijIFXXXXahXXXXXXXXXXXX.png)

**or pic b:**

![](https://img.alicdn.com/tps/TB1e4avIFXXXXcpXXXXXXXXXXXX.png)

Actually, you can make it whatever you want. All you need is a XML
file to descirbe it. 

For **pic a** as shown above, we can describe the flow like this:
```
middleware1
  middleware2
    middleware3
  middleware3
```

For **pic b** as shown above, we can describe the flow like this:
```
middleware1
  middleware2
middleware2
  middleware3
```

## Why jade?
Because it is convienient to write XML using its syntax. By using its [lexer](https://github.com/jadejs/jade-lexer) and [parser](https://github.com/jadejs/jade-parser), 


# Install
`$ npm install jade-flow`

# Lisence
MIT
