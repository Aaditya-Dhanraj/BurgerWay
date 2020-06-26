import React, { Component, Fragment } from "react";
import Auxilary from "../../HOC/auxilary";
import Burger from "../../components/Burger/Burger";
import BuildControl from "../../components/Burger/BuildControls/BuildControl";
import Modal from "../../components/UI/Model/Model";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-order";
import WithErrorHandler from "../../WithErrorHandler/WithErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

let INGREDIENT_PRICE = {
  salad: 20.03,
  bacon: 40.07,
  cheese: 25.04,
  meat: 65.06,
};

class BurgerBuilder extends Component {
  // constructor(props){
  //   super(props);
  //   this.state={...}
  // }
  state = {
    ingredients: null,
    totalPrice: 30,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get("https://react-burgerway.firebaseio.com/ingredients.json")
      .then((Response) => {
        this.setState({ ingredients: Response.data });
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  updatePerchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igkey) => {
        return ingredients[igkey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchaseable: sum > 0 });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const UpdatedIngredients = {
      ...this.state.ingredients,
    };
    UpdatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients: UpdatedIngredients,
    });
    this.updatePerchaseState(UpdatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount - 1;
    const UpdatedIngredients = {
      ...this.state.ingredients,
    };
    UpdatedIngredients[type] = updatedCount;
    const priceSubstraction = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceSubstraction;
    this.setState({
      totalPrice: newPrice,
      ingredients: UpdatedIngredients,
    });
  };

  puchasingHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    //  alert("You Continue !!!");
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Aaditya",
        address: {
          street: "Thana road Khagaria",
          zipcode: "851204",
          country: "India",
        },
        email: "test@test.com",
      },
      deliveryMethod: "fastest",
    };
    axios
      .post("/orders.json", order)
      .then((Response) => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch((error) => {
        this.setState({ loading: false, purchasing: false });
      });
  };

  render() {
    const DisabledBtn = {
      ...this.state.ingredients,
    };
    for (let key in DisabledBtn) {
      DisabledBtn[key] = DisabledBtn[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? (
      <p>Ingredients Can't Load At This Moment</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingredients) {
      burger = (
        <Auxilary>
          <Burger ingredients={this.state.ingredients} />
          <BuildControl
            ingredientAdded={this.addIngredientHandler}
            ingredientSubstracted={this.removeIngredientHandler}
            disabled={DisabledBtn}
            price={this.state.totalPrice}
            purchaseable={this.state.purchaseable}
            ordered={this.puchasingHandler}
          />
        </Auxilary>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCancel={this.purchaseCancelHandler}
          purchaseContinue={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Auxilary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxilary>
    );
  }
}

export default WithErrorHandler(BurgerBuilder, axios);
