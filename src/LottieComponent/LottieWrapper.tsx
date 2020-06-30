import * as React from "react";

import Lottie from 'react-lottie';

export interface ILottieWrapperProps {
    animationData: any;
    loop?: boolean;
    autoplay?: boolean;
    speed: number | null;
    onComplete?: () => void;
    onStart?: () => void;
    onStop?: () => void;
    onPause?: () => void;
}

export interface ILottieWrapperState {
    isStopped: boolean;
    isComplete: boolean;
    isPaused: boolean;
    segments?: ReadonlyArray<number>;
}

export class LottieWrapper extends React.Component<ILottieWrapperProps, ILottieWrapperState>{
    constructor(props: ILottieWrapperProps) {
        super(props);
        this.state = { isStopped: !this.props.autoplay, isPaused: !this.props.autoplay, isComplete: false, segments: undefined };
    }

    render() {

        const defaultOptions = {
            loop: this.props.loop,
            autoplay: this.props.autoplay,
            animationData: this.props.animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            }
        };

        return (
            <Lottie
                options={defaultOptions}
                speed={this.props.speed || undefined}
                isClickToPauseDisabled={true}
                segments={this.state.segments}
                eventListeners={[
                    {
                        eventName: 'complete',
                        callback: () => this.onComplete()
                    }
                ]}
                isStopped={this.state.isStopped} isPaused={this.state.isPaused} />
        );
    }

    onStart = () => {
        if (this.props.onStart) {
            this.props.onStart();
        }
    }

    dataReady = () => {
        console.log()
    }

    onComplete = () => {
        if (!this.state.isComplete) {
            this.setState({ isComplete: true });
        }
        if (this.props.onComplete) {
            this.props.onComplete();
        }
    }

    onStop = () => {
        if (this.props.onStop) {
            this.props.onStop();
        }
    }

    onPause = () => {
        if (this.props.onPause) {
            this.props.onPause();
        }
    }

    playOrResume = (startFrame?:number, endFrame?:number) => {
        if (this.state.isStopped || this.state.isComplete) {
            this.setState({ isStopped: true });
            this.setState({ isStopped: false });
        }

        if (this.state.isPaused) {
            this.setState({ isPaused: false });
        }

        this.onStart();
    }

    // testing...
    playSegments = (segments?: ReadonlyArray<number>) => {
        this.setState({ segments: segments });

        if (segments !== undefined) {
            if (this.state.isStopped) {
                this.setState({ isStopped: false });
            }

            if (this.state.isPaused) {
                this.setState({ isPaused: false });
            }
        }
    }

    pause = () => {

        if (!this.state.isPaused) {
            this.setState({ isPaused: true });
        }

        this.onPause();
    }

    stop = () => {
        if (!this.state.isStopped) {
            this.setState({ isStopped: true });
        }
        this.onStop();
    }
}