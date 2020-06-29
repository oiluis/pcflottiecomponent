# pcflottiecomponent
This is a PCF wrapper for the Lottie Animation Library. A Lottie is a JSON-based animation file format that enables designers to ship animations on any platform as easily as shipping static assets. ... Open-source and free Lottie players exist for the web, iOS, Android, Windows, QT, Tizen and other platforms.

Once you imported the solution on your environment, you just need to create a new Canvas App, import the Code Component and add the LottieComponent on your canvas.
Make sure you have the Code Component feature enabled on your environment:
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps#enable-power-apps-component-framework-feature

In case you are new to Code Components (aka PCF) and you would like to know how to import and add a PCF on your canvas apps, just need to follow these steps:
https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps#add-components-to-a-canvas-app

## Controling the animation
When you added the Lottie Component onto your canvas, it is good to change the default Component name first. After that, if you want to start the animation you can use the AutoPlay property and/or if you want to manually play the app, you just need to declare and set a string variable that will be bounded with the StartAnimationToken property. Whenever you change the value of this property, the animation will start. See the example below:
