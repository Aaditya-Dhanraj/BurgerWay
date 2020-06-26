import React from "react";
import classes from "./BuildControl.module.css";
import BuildControlcomp from "./Buildcontrolcomp/BuildControlcomp";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" },
];

const BuildControl = (props) => {
  return (
    <div className={classes.BuildControl}>
      <p className={classes.price}>
        Current Price :<strong>{props.price.toFixed(2)}</strong>
      </p>
      {controls.map((ctrl) => {
        return (
          <BuildControlcomp
            key={ctrl.label}
            label={ctrl.label}
            added={() => props.ingredientAdded(ctrl.type)}
            substracted={() => props.ingredientSubstracted(ctrl.type)}
            disabled={props.disabled[ctrl.type]}
          />
        );
      })}
      <div className={classes.Order}>
        <button
          className={classes.OrderButton}
          disabled={!props.purchaseable}
          onClick={props.ordered}
        >
          ORDER NOW
        </button>
      </div>
    </div>
  );
};

export default BuildControl;
