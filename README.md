# jade-flow
a powerful control flow model described by [jade syntax](https://github.com/jadejs/jade).Inspired by [koa](https://github.com/koajs/koa).

## Control flow in Koa
As we all know in koa, the control flow goes like this:
![](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)

Let's say it looks like a `U` shape as below:

![](https://img.alicdn.com/tps/TB1Bp8WIFXXXXbPXFXXXXXXXXXX.png)

Once the flow reaches the bottom of the middleware stack, it has to go
back along the way it comes.

## What's new in jade-flow
It provides much more flexibilities and allows the control flow go like a `W` shape as below:

![](https://img.alicdn.com/tps/TB1hSijIFXXXXahXXXXXXXXXXXX.png)

or

![](https://img.alicdn.com/tps/TB1vQN2IFXXXXcbXFXXXXXXXXXX.png)

Actually, you can make it whatever you want. All you need is a config
file to descirbe it.


# install
`$ npm install jade-flow`

# Lisence
MIT
