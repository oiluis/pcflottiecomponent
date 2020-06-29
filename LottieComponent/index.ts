import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import { LottieAnimation } from './LottieAnimation';
import { Guid } from 'guid-typescript';

export class LottieComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // the Div main container
    private theContainer: HTMLDivElement;

    // the Lottie JSON animation
    private animationData: any | null;

    // the Lottie external URL
    private animationDataURL: string;

    // wrapper for the Lottie React component
    private lottie: LottieAnimation;

    // whether the animation should play on loop
    private loop?: boolean = false;

    // the animation speed
    private speed: number | null = 0;

    // the start animation Token. It can be a GUID string or any other string. Every time the token changes the animation will be played.
    private startAnimationToken?: string = '';

    // reference to the notifyOutputChanged method
    private notifyOutputChanged: () => void;

    // defines if the animation is stopped or not (output property)
    private isStopped?: boolean = true;

    // defines the the animation is stopped or not (output property)
    private isPaused?: boolean = true;

    // defines the initial frame to play
    private totalFrame?: number;

    // defines the end frame (range)
    private currentFrame?: number;

    // to avoid multiple creation of Lottie instance
    private creatingLottie:boolean = false;

    /**
     * Empty constructor.
     */
    constructor() {}

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ) {
        // Add control initialization code
        this.theContainer = container;
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * ReRender: Speed, AutoPlay, Loop | StartAnimationToken
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public async updateView(context: ComponentFramework.Context<IInputs>) {
        const url = context.parameters.LottieAnimationURL.raw;
        // if the Lottie Animation was loaded and the Lottie Wrapper wasn't created or any property on the property bag has changed
        if (this.isValidUrl(url) && (!this.lottie || (this.animationDataURL != url))) {
            this.createLottie(
                url as string,
                context.parameters.Speed.raw,
                context.parameters.Loop.raw,
                context.parameters.AutoPlay.raw
            );

            // creates the animation token in case it is a auto play...
            if (context.parameters.AutoPlay.raw) {
                this.startAnimationToken = Guid.create().toString();
            }

            this.notifyOutputChanged(); // to set the default values back to the Power Apps editor ...
        }

        if (this.lottie) {
            this.controlAnimation(context);
        }
    }

    /**
     * This method will play, pause or stop the animation
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    controlAnimation(context: ComponentFramework.Context<IInputs>): void {
        const startAnimationToken = context.parameters.StartAnimationToken.raw;
        const pauseAnimationToken = context.parameters.PauseAnimationToken.raw;
        const stopAnimationToken = context.parameters.StopAnimationToken.raw;
        const startEndFramesInput = context.parameters.StartEndFrame.raw;
        const speed = context.parameters.Speed.raw;
        let animationTokenHasChanged = false;

        if (startAnimationToken && this.startAnimationToken != startAnimationToken) {
            this.startAnimationToken = startAnimationToken;
            animationTokenHasChanged = true;
            this.notifyOutputChanged();
        }

        if (animationTokenHasChanged && (this.isStopped || this.isPaused)) {
            this.lottie.play(
                !startEndFramesInput
                    ? null
                    : startEndFramesInput.split(',').map((i) => {
                          return parseInt(i, 10);
                      })
            );
        } else if (pauseAnimationToken && this.startAnimationToken === pauseAnimationToken && !this.isPaused) {
            this.lottie.pause();
        } else if (stopAnimationToken && this.startAnimationToken === stopAnimationToken && !this.isStopped) {
            this.lottie.stop();
        } else {
            // for log purpose only
        }

        this.lottie.setSpeed(speed || 1);
    }

    /**
     * Creates and overries the Lottie Wrapper component
     * @param animationData the Lottie JSON animation data
     * @param speed the speed of the animation
     * @param autoplay whether the animation should automatically play or not
     * @param loop whether the animation should play on loop
     */
    async createLottie(animationURL: string, speed: number | null, loop?: boolean, autoplay?: boolean) {
        
        if(this.creatingLottie) 
            return;

        this.creatingLottie = true;
        this.animationData = (await axios.get(animationURL)).data;
        //console.log('creating Lottie once ... ls', window.localStorage);
        this.lottie = ReactDOM.render(
            React.createElement(LottieAnimation, {
                animationData: this.animationData,
                loop: loop || this.loop,
                speed: speed,
                autoplay: autoplay,
                onComplete: this.onAnimationComplete,
                onPause: this.onAnimationPaused,
                onStart: this.onAnimationStarted,
                onStop: this.onAnimationStopped,
            }),
            this.theContainer
        );

        this.creatingLottie = false;
        this.animationDataURL = animationURL;
    }

    /**
     * Whenever the Lottie animation was started,
     */
    onAnimationStarted = (currentFrame:number, totalFrame: number) => {
        this.isStopped = false;
        this.isPaused = false;
        this.currentFrame = currentFrame;
        this.totalFrame = totalFrame;
        this.notifyOutputChanged();
    };

    /**
     * Whenever the Lottie  animation was reached the last frame.
     */
    onAnimationComplete = (currentFrame:number) => {
        this.currentFrame = currentFrame;
        this.isStopped = true;
        this.notifyOutputChanged();
    };

    /**
     * Whenever the Lottie animation was stopped by the user.
     */
    onAnimationStopped = () => {
        this.currentFrame = 0;
        this.isStopped = true;
        this.notifyOutputChanged();
    };

    /**
     * Whenever the Lottie animation was paused by the user.
     */
    onAnimationPaused = (currentFrame: number) => {
        this.isPaused = true;
        this.currentFrame = currentFrame;
        this.notifyOutputChanged();
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            IsStopped: this.isStopped,
            IsPaused: this.isPaused,
            StartAnimationToken: this.startAnimationToken,
            CurrentFrame: this.currentFrame,
            TotalFrame: this.totalFrame,
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {

        this.isPaused = true;
        this.isPaused = true;
        this.animationDataURL = '';
        this.startAnimationToken = '';
        this.creatingLottie = false;

        ReactDOM.unmountComponentAtNode(this.theContainer);
    }

    /**
     * Checks whether the URL is valid or not
     * @param url the Lottie animation URL
     */
    isValidUrl(url: string | null): boolean {
        if (url !== null) {
            var res = url.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            );
            return res !== null;
        }
        return false;
    }
}
