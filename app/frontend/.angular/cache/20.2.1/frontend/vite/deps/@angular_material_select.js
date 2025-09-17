import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-22GS763C.js";
import "./chunk-WZBH6K54.js";
import "./chunk-HSNXHXHA.js";
import "./chunk-XEDDPHEO.js";
import "./chunk-YDOIFKP7.js";
import "./chunk-3KSY5XWT.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-XUHJQKBA.js";
import "./chunk-XURWJXFX.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-A5MUH5XD.js";
import "./chunk-QPH2URWU.js";
import "./chunk-YFXYTJMG.js";
import "./chunk-2T5HYLQL.js";
import "./chunk-VH5EN5CN.js";
import "./chunk-62G6Q6E6.js";
import "./chunk-LTMKULCB.js";
import "./chunk-TWYM27AY.js";
import "./chunk-Z5ANAJLU.js";
import "./chunk-GWFLKVBH.js";
import "./chunk-FE7TKVCD.js";
import "./chunk-7UJZXIJQ.js";
import "./chunk-QHOXONDS.js";
import "./chunk-4HO625B4.js";
import "./chunk-R2RNR56W.js";
import "./chunk-TSLLPUPR.js";
import "./chunk-FZBQARSG.js";
import "./chunk-YW65FSQM.js";
import "./chunk-WCCCVU43.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-MARUHEWW.js";
import "./chunk-EIB7IA3J.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [
      {
        type: 0,
        name: "void",
        styles: {
          type: 6,
          styles: { opacity: 0, transform: "scale(1, 0.8)" },
          offset: null
        }
      },
      {
        type: 1,
        expr: "void => showing",
        animation: {
          type: 4,
          styles: {
            type: 6,
            styles: { opacity: 1, transform: "scale(1, 1)" },
            offset: null
          },
          timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
        },
        options: null
      },
      {
        type: 1,
        expr: "* => void",
        animation: {
          type: 4,
          styles: { type: 6, styles: { opacity: 0 }, offset: null },
          timings: "100ms linear"
        },
        options: null
      }
    ],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
