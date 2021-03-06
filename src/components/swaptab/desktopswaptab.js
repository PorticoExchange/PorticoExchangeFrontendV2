import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import SwapTabWrapper from './swaptabwrapper';
import { MdCompareArrows } from 'react-icons/md';
import View from '../view';
import Input from '../input';
import DropDown from '../dropdown';
import Controls from '../controls';
import Button from '../button';
import Text, { InfoText } from '../text';
import { formatAmount } from '../../utils';

// import { Button as SButton, Box } from '@stacks/ui'
// import { MdAccountBalanceWallet } from 'react-icons/md';

// import { Box, Button, ButtonProps, Stack, StackProps } from '@stacks/ui';

// import Dotxbutton from '../dotxbutton';
// <Dotxbutton/>

const DeskTopSwapTabContent = ({
  classes,
  feeAmount,
  minAmount,
  maxAmount,
  inputError,
  baseAmount,
  base,
  currencies,
  quote,
  quoteAmount,
  error,
  errorMessage,
  disabled,
  rate,
  switchPair,
  updateQuoteAmount,
  updateBaseAmount,
  updatePair,
  shouldSubmit,
  baseStep,
  quoteStep,
  feePercentage,
  connectWallet,
  connectStacksWallet,
  lockStx,
  stacksUserSession,
}) => (
  <View className={classes.wrapper}>
    <View className={classes.connectButton}>
      {stacksUserSession() ? (<Button
        text={stacksUserSession()}
        className={classes.loggedintext}
        // error={error || inputError}
        onPress={error ? () => {} : () => connectStacksWallet()}
        // errorText={errorMessage}
      />) : null }
      {/* <Button
        text={'Lock STX'}
        // error={error || inputError}
        onPress={error ? () => {} : () => lockStx()}
        // errorText={errorMessage}
      /> */}
      
    </View>
    <View className={classes.stats}>
      <InfoText
        title="Min amount"
        text={`${formatAmount(minAmount)} ${base}`}
      />
      <InfoText
        title="Max amount"
        text={`${formatAmount(maxAmount)} ${base}`}
      />
      <InfoText
        title="Current fee"
        text={`${feeAmount} ${base} (${feePercentage}%)`}
      />
      <InfoText title="Rate" text={`${rate}`} />
    </View>
    <View className={classes.options}>
      <View className={classes.select}>
        <Text text="You send:" className={classes.text} />
        <Input
          disable={disabled}
          className={classes.inputMobile}
          min={minAmount}
          max={maxAmount}
          step={quoteStep}
          error={inputError}
          value={baseAmount}
          onChange={updateQuoteAmount}
        />
        <DropDown
          className={classes.inputMobile}
          defaultValue={base}
          fields={currencies}
          onChange={e => updatePair(quote, e)}
        />
      </View>

      {/* <SButton
          size="large"
          pl="base-tight"
          pr={'base'}
          py="tight"
          fontSize={2}
          mode="primary"
          position="relative"
          className={classes.sbuttoncl}
          // ref={ref}
          onClick={() => lockStx()}
          borderRadius="10px"
          // {...rest}
        >
          <Box
            as={MdAccountBalanceWallet}
            // transform={isSend ? 'unset' : 'scaleY(-1)'}
            size={'16px'}
            mr={'2px'}
          />
          <Box as="span" ml="2px" fontSize="large">
            Lock STX
          </Box>
        </SButton> */}


      <MdCompareArrows className={classes.arrows} onClick={switchPair} />
      <View className={classes.select}>
        <Text text="You receive:" className={classes.text} />
        <Input
          disable={disabled}
          className={classes.inputMobile}
          min={baseStep}
          max={Number.MAX_SAFE_INTEGER}
          step={baseStep}
          error={inputError}
          value={quoteAmount}
          onChange={updateBaseAmount}
        />
        <DropDown
          className={classes.inputMobile}
          defaultValue={quote}
          fields={currencies}
          onChange={e => updatePair(e, base)}
        />
      </View>
    </View>
    <View className={classes.next}>
      <Controls
        text={'Start swap'}
        error={error || inputError}
        onPress={error ? () => {} : () => shouldSubmit()}
        errorText={errorMessage}
      />
    </View>
  </View>
);

const styles = theme => ({
  wrapper: {
    margin: '15px',
    height: '400px',
    width: '600px',
    flexDirection: 'column',
    backgroundColor: '#fff',
    '@media (min-width: 1500px)': {
      width: '800px',
      height: '600px',
    },
    '@media (max-width: 500px)': {
      width: '100%',
      height: '400px',
    },
    borderRadius: '8px',
  },
  inputMobile: {
    '@media (max-width: 500px)': {
      width: '100px',
      fontSize: '16px',
    },
  },
  stats: {
    backgroundColor: '#fff',
    height: '15%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '5%'
  },
  options: {
    flex: '1 0 70%',
    flexDirection: 'column',
  },
  select: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  next: {
    // backgroundColor: 'rgba(85,70,255,1)',
    backgroundColor: 'rgba(85,70,255,1)',
    flex: '1 0 15%',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  sbuttoncl: {
    margin: 'auto',
    width: 'fit-content',
    padding: '15px',
  },
  connectButton: {
    backgroundColor: '#4A4A4A',
    flex: '1 1 25%',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  loggedintext: {
    fontSize: 'inherit',
  },
  nextError: {
    backgroundColor: '#4A4A4A',
    flex: '1 0 15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '300',
  },
  nextIcon: {
    fontSize: 26,
    padding: '10px',
    transition: '0.3s',
    color: '#fff',
    '&:hover': {
      color: '#D3D3D3',
    },
  },
  text: {
    fontSize: '20px',
  },
  arrows: {
    height: '30px',
    width: '30px',
    marginLeft: '80%',
    cursor: 'pointer',
    transform: 'rotate(90deg)',
    transition: 'none 200ms ease-out',
    transitionProperty: 'color',
    color: '#4A4A4A',
    '&:hover': {
      color: '#9D9D9D',
    },
  },
});

DeskTopSwapTabContent.propTypes = {
  classes: PropTypes.object,
  onPress: PropTypes.func,
  feePercentage: PropTypes.number.isRequired,
  limits: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  quote: PropTypes.string,
  quoteAmount: PropTypes.number,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  feeAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minAmount: PropTypes.number,
  maxAmount: PropTypes.number,
  inputError: PropTypes.bool,
  baseAmount: PropTypes.number,
  base: PropTypes.string,
  disabled: PropTypes.bool,
  rate: PropTypes.string,
  switchPair: PropTypes.func,
  updateQuoteAmount: PropTypes.func,
  updateBaseAmount: PropTypes.func,
  updatePair: PropTypes.func,
  shouldSubmit: PropTypes.func,
  baseStep: PropTypes.string,
  quoteStep: PropTypes.string,
  connectWallet: PropTypes.func,
  connectStacksWallet: PropTypes.func,
  lockStx: PropTypes.func,
  stacksUserSession: PropTypes.func,
};

const DeskTopSwapTab = props => (
  <SwapTabWrapper {...props}>
    {p => <DeskTopSwapTabContent {...p} />}
  </SwapTabWrapper>
);

export default injectSheet(styles)(DeskTopSwapTab);
