import React, { Component } from "react";
import classes from "./Model.module.css";
import Backdrop from "../BackDrop/BackDrop";
import Auxilary from "../../../HOC/auxilary";

class modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  componentWillUpdate() {
    console.log("modal will update");
  }

  render() {
    return (
      <Auxilary>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: this.props.show ? "1" : "0",
          }}
        >
          {this.props.children}
        </div>
      </Auxilary>
    );
  }
}

export default modal;
