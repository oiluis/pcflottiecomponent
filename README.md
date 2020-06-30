# pcflottiecomponent
This is a PCF wrapper for the [Lottie](http://lottiefiles.com) Animation Library. A Lottie is a JSON-based animation file format that enables designers to ship animations on any platform as easily as shipping static assets. ... Open-source and free Lottie players exist for the web, iOS, Android, Windows, QT, Tizen and other platforms.<br/>

[Watch and enjoy :)](https://youtu.be/RC1P0RsiqSE)

Once you imported the solution on your environment, you just need to create a new Canvas App, import the Code Component and add the LottieComponent on your canvas.
[Make sure you have the Code Component feature enabled on your environment](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps#enable-power-apps-component-framework-feature)


In case you are new to Code Components (aka PCF) and you would like to know how to import and add a PCF on your canvas apps, just need to follow [these steps](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/component-framework-for-canvas-apps#add-components-to-a-canvas-app).


## Controling the animation
### Basics
When you added the Lottie Component onto your canvas, it is good to change the default Component name first, since the default name makes it hard to access the component properties. <br/>
As currently there is no way to invoke a custom method from a PCF within the App, the way that the App controls the execution of the animation is through property update. 
So whenever you change some of the component properties explained below this process will start, pause or stop the animation. <br/>

Feel free to take a look at the Component Properties and play with them as you wish.

### Starting an animation
After that, if you want to start the animation you can use the AutoPlay property and/or if you want to manually play the animation, you just need to declare and set a string variable that will be bounded with the StartAnimationToken property. Whenever you change the value of this property, the animation will start. See the example below:

<img src="/docs/assets/setAnimationToken.png" alt="Start Animation Token" width="600"/>

The animation will only play if you change the value of the "Start Animation Token", that's the reason we are using the internal GUID() function from Power Apps.

### Stopping or Pausing an animation
In case you want stop or pause your animation you will follow these simple steps: 
1. Declare / Set a local variable which will hold the Start Animation Token value you want to pause or stop.
2. IMPORTANT: Update the properties "Stop Animation Token" or "Pause Animation Token" (if you want to pause your animation) using the declared variable.

<img src="/docs/assets/stopAnimationToken.png" alt="Start Animation Token" width="600"/>

So on the example above, whenever the user hit the "Stop" button it will set the "StopAnimationToken" with the last value of the "StartAnimationToken" and as the "StopAnimationToken" variable is bounded with the Component.StopAnimationToken property, the animation will stop. This is the same principle in case you want to pause your animation, you will just need to use the "PauseAnimationToken" property.

### Playing specific segments
In case you want to play specific segments (aka frames) of your animation, you can set or update the "StartAndEndFrame" property and then set the "StartAnimationToken" again, following the same process explained above.

<img src="/docs/assets/playSegments.png" alt="Start Animation Token" width="600"/>

## Output properties
This component expose the following properties:

* **IsStopped:** Indicates whether or not the animation reached the last frame
* **IsPaused:** Indicates whether or not the animation is paused
* **CurrentFrame:** The current frame number of the animation
* **TotalFrame:** Determines the length (quantity of frames) that your animation has
* **StartAnimationToken:** Useful if you want to Stop or Pause your animation
