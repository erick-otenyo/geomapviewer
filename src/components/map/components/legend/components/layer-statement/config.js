export default {
  lossLayer: {
    // if we want to add this disclaimer (with the hover) to a widget in the legend,
    // - type must be 'lossLayer' in the 'legend' section of the layer, OR
    // - the layer has to have 'isLossLayer=true' in the metadata.
    // For the second case (isLossLayer), type is being overwritten to 'lossLayer'
    // in dataset-provider-actions#L56 (add more special here cases if needed)
    statementPlain: 'Tree cover loss',
    statementHighlight: ' is not always deforestation.',
    tooltipDesc:
      'Loss of tree cover may occur for many reasons, including deforestation, fire, and logging within the course of sustainable forestry operations. In sustainably managed forests, the “loss” will eventually show up as “gain”, as young trees get large enough to achieve canopy closure.',
  },
  mosaicLandscapes: {
    statementPlain:
      'Note: This dataset is in draft form and is subject to change.',
    // statementHighlight: 'is not always deforestation.',
    // tooltipDesc:
    //   'Loss of tree cover may occur for many reasons, including deforestation, fire, and logging within the course of sustainable forestry operations. In sustainably managed forests, the “loss” will eventually show up as “gain”, as young trees get large enough to achieve canopy closure.',
  },
  isoLayer: {
    statementPlain: 'This layer is only available for ',
    statementHighlight: 'certain countries.',
  },
  kbaLayer: {
    statementPlain: 'non-commercial use only',
  },
  lossDriverLayer: {
    statementHighlight: 'Hover for details on drivers classes.',
    tooltipDesc: `Commodity driven deforestation: Large-scale deforestation linked primarily to commercial agricultural expansion.\n
      Shifting agriculture: Temporary loss or permanent deforestation due to small- and medium-scale agriculture.\n
      Forestry: Temporary loss from plantation and natural forest harvesting, with some deforestation of primary forests.\n
      Wildfire: Temporary loss, does not include fire clearing for agriculture.\n
      Urbanization: Deforestation for expansion/intensification of urban centers.`,
  },
};
