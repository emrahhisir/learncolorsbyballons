/**
 * Common definitions
 */

import PropTypes from "prop-types";

const numberProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
const funcProp = PropTypes.func;
export { numberProp, funcProp };

export const LCBB_FPS_MS = 40.0;
