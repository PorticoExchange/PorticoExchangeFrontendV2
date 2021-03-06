import { connect } from 'react-redux';
import Refund from './refund';
import * as actions from '../../actions/refundActions';

const mapStateToProps = state => ({
  refundFile: state.refundReducer.refundFile,
  transactionHash: state.refundReducer.transactionHash,
  destinationAddress: state.refundReducer.destinationAddress,
  refundTransactionHash: state.refundReducer.refundTransactionHash,
  isFetching: state.refundReducer.isFetching,
});

const mapDispatchToProps = dispatch => ({
  setRefundFile: file => dispatch(actions.setRefundFile(file)),
  setTransactionHash: hash => dispatch(actions.setTransactionHash(hash)),
  setDestinationAddress: address =>
    dispatch(actions.setDestinationAddress(address)),
  startRefund: (refundFile, transactionHash, destinationAddress, cb) =>
    dispatch(
      actions.startRefund(refundFile, transactionHash, destinationAddress, cb)
    ),
  completeRefund: () => dispatch(actions.completeRefund()),
  setRefundFromTx: txId => dispatch(actions.setRefundFromTx(txId)),
  // refundStx: (swapInfo, swapResponse) => dispatch(actions.refundStx(swapInfo, swapResponse)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Refund);
