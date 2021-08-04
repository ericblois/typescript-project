import { Component } from "react";
import ProductShopPage from "../BusinessShopPages/ProductShopPage";

export default class CustomComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {
    
    componentMounted = false

    componentDidMount() {
        this.componentMounted = true
        if (super.componentDidMount) {
            super.componentDidMount()
        }
    }

    componentWillUnmount() {
        this.componentMounted = false
        if (super.componentWillUnmount) {
            super.componentWillUnmount()
        }
    }

    setState(state: S | ((prevState: Readonly<S>, props: Readonly<P>) => S | Pick<S, never> | null) | Pick<S, never> | null, callback?: (() => void) | undefined) {
        if (this.componentMounted) {
            super.setState(state, callback)
        }
    }
}