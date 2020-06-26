import React, { Component } from "react";
import Auxilary from "../HOC/auxilary";
import Modal from "../components/UI/Model/Model";
import axios from "axios";

const WithErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
      message: "Something is Wrong",
    };

    componentWillMount() {
      this.reqInterceptor = axios.interceptors.response.use((Request) => {
        this.setState({ error: null });
        return Request;
      });

      this.resInterceptor = axios.interceptors.response.use(
        (res) => res,
        (error) => {
          this.setState({ error: error });
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.request.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      return (
        <Auxilary>
          <Modal
            show
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Auxilary>
      );
    }
  };
};

export default WithErrorHandler;
