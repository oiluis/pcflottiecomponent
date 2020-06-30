import * as React from "react";
import * as LottieWeb from 'lottie-web/';
import { lookup } from "dns";
export interface ILottieAnimationProps {
    animationData: any | null;
    loop?: boolean;
    autoplay?: boolean;
    speed: number | null;
    segments?: number[];
    onComplete?: (currentFrame:number) => void;
    onStart?: (currentFrame:number, totalFrame:number) => void;
    onStop?: () => void;
    onPause?: (currentFrame:number) => void;
    onEnterFrame?: (currentFrame: number, totalFrame: number) => void;
}

export interface ILottieAnimationState {
    animationData: any | null;
}

export class LottieAnimation extends React.Component<ILottieAnimationProps, ILottieAnimationState> {

    // the animation container
    private el: HTMLDivElement | null;

    // the lottie animation element
    private anim: LottieWeb.AnimationItem;

    // the lootie player
    private lottie: any = LottieWeb;

    // component options
    private options: LottieWeb.AnimationConfigWithData;

    // Whether the onStart event was triggered or not
    private hasTriggeredOnStart:boolean = false;

    // the current frame number
    private currentFrame:number = 0;

    // the total frame count
    private totalFrame:number;

    // to keep the animation from where it paused
    private lastFrame:number | null;

    constructor(props: ILottieAnimationProps) {
        super(props);
        this.state = {
            animationData: this.props.animationData
        };
    }

    componentDidMount() {

        this.options = {
            container: this.el as HTMLDivElement,
            renderer: 'svg',
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            }, 
            ...this.props
        };

        this.anim = this.lottie.loadAnimation(this.options);
        this.bindEvents();
    }

    componentWillUpdate(props: any) {
        /* Recreate the animation handle if the data is changed */
        if (this.options.animationData !== props.animationData) {
            this.destroy();

            this.options = {...this.options, ...props};
            this.anim = this.lottie.loadAnimation(this.options);

            this.bindEvents();
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    setSpeed = (speed:number) => {
        this.anim.setSpeed(speed);
    }

    play = (segments:number[] | null) => {
        this.hasTriggeredOnStart = false;
        if (segments !== null && segments.length === 2) { 
            this.anim.playSegments([ this.lastFrame ? this.lastFrame : segments[0], segments[1]],true); 
        } else {
            this.anim.goToAndPlay(this.lastFrame ? this.lastFrame : 0,true);
        }

        this.lastFrame = null;
    }

    stop = () => {
        this.anim.stop();
        this.lastFrame = null;
        this.onStop();
    }

    pause = () => {
        if (!this.anim.isPaused) {
            this.anim.pause();
            this.lastFrame = this.currentFrame;
            this.onPause();
        }
    }

    onComplete = (e: any) => {
        this.lastFrame = null;
        if (this.props.onComplete) {
            this.props.onComplete(this.currentFrame);
        }
    }

    onPause = () => {
        if (this.props.onPause) {
            this.props.onPause(this.currentFrame);
        }
    }

    onStop = () => {
        this.currentFrame = 0;
        if (this.props.onStop) {
            this.props.onStop();
        }
    }

    onEnterFrame = (e: any) => {
        this.currentFrame = e.currentTime as number;
        this.totalFrame = e.totalTime as number;

        if(!this.hasTriggeredOnStart) {        
            if(this.props.onStart){
                this.props.onStart(this.currentFrame, this.totalFrame);
            }

            this.hasTriggeredOnStart = true;
        }

        if (this.props.onEnterFrame) {
            this.props.onEnterFrame(this.currentFrame, this.totalFrame);
        }
    }

    bindEvents = () => {
        this.anim.addEventListener('complete', this.onComplete);
        this.anim.addEventListener('enterFrame', this.onEnterFrame);
    }

    unbindEvents = () => {
        this.anim.removeEventListener('complete', this.onComplete);
        this.anim.removeEventListener('enterFrame', this.onEnterFrame);
    }

    destroy = () => {
        this.hasTriggeredOnStart = false;
        this.unbindEvents();
        this.currentFrame = 0;
        this.lastFrame = null;
        this.anim.destroy();
    }

    render() {

        const lottieStyles = {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            margin: '0 auto',
            outline: 'none',
        };

        return (<div
            style={lottieStyles}
            role='button'
            arial-label='animation'
            title='Lottie Animation'
            ref={(c) => {
                this.el = c;
            }}
        />)
    }
}