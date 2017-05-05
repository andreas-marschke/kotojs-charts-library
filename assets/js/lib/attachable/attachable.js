"use strict";
import BaseChart from "../base/base.js";

/**
 * An abstract class defining behavior for attaching elements to charts ie. Legends
 */
class AttachableChart extends BaseChart
{
  constructor(container) {
    super(container);
    this._attachments = {};
  }

  addAttachment(name, chart) {
    this._attachments[name] = chart;
    this.attach(chart);
  }

  hasAttachment() {

  }
}
