import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import View from '../../components/view';
import Link from '../../components/link';
import NavigationBar from '../../components/navigationbar';
import Question from '../../components/question';
import NodeInfo from '../../components/nodeinfo';
import BackGround from '../../components/background';
import {
  bitcoinLnd,
  litecoinLnd,
  rbtcLnd,
  lbtcLnd,
  lnurlLnd,
  bitcoinLndOnion,
  litecoinLndOnion,
} from '../../constants';

const styles = theme => ({
  wrapper: {
    flex: '1 0 100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '42px',
    color: '#fff',
  },
  questionTab: {
    backgroundColor: '#fff',
    minWidth: '820px',
    maxWidth: '920px',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
    paddingTop: '10px',
    paddingBottom: '10px',
    '@media (max-width: 425px)': {
      justifyContent: 'center',
      minWidth: '100%',
      maxWidth: '100%',
    },
  },
});

const twitterLink = 'https://twitter.com/porticoexchange';
const discordLink = 'https://discord.gg/vDUvgSkcPR';
const LnSwapDiscordLink = 'https://discord.gg/vDUvgSkcPR';
const LnSwapTwitterLink = 'https://twitter.com/porticoexchange';

class Faq extends React.Component {
  render() {
    const { classes } = this.props;

    document.body.style.overflowX = 'hidden';

    return (
      <BackGround>
        <NavigationBar />
        <View className={classes.wrapper}>
          <View className={classes.titleWrapper}>
            <h1 className={classes.title}>FAQ&apos;s</h1>
          </View>
          <View className={classes.questionTab}>
            <Question
              title={style => <h1 className={style}>What is Portico Exchange?</h1>}
              content={style => (
                <p className={style}>
                  Portico Exchange is a non custodial Bitcoin exchange that
                  provides a fast, private way of swapping Bitcoin between layers 
                  and sidechain. We don't use any trackers or log any data that
                  could identify our users. <br /> <br />
                  Please note that this software is currently in alpha stage and
                  is heavily worked on.
                  <Link to={PorticoExchangeDiscordLink} text={'PorticoExchange Discord'} /> #support channel or  {' '}
                  < DM on <Link to={PorticoExchangeTwitterLink} text={'@porticoexchange'} /> on Twitter.
                </p>
              )}
            />
            <Question
              title={style => (
                <h1 className={style}>
                  Why should one use a non custodial exchange?
                </h1>
              )}
              content={style => (
                <p className={style}>
                  Non custodial exchanges give you full control over your funds.
                  All trades on Portico Exchange are executed in a way that we cannot
                  steal any money from you. Period.
                  <br />
                  <br />
                  Either the trade happens entirely and you get the exact amount
                  of the asset you were promised or you will be able to do a
                  refund. This concept is called <i>atomicity</i> and it is
                  achieved with so-called <i>Submarine Swaps</i>. You can read
                  more about them in{' '}
                  <Link
                    to={
                      'https://medium.com/boltzhq/submarine-swaps-c509ce0fb1db'
                    }
                    text={'this blog post from Boltz'}
                  />
                  {'.'}
                  <br />
                  <br />
                  If you are <i>really</i> technical you can proof read our
                  source code and verify that the claims above are valid because
                  everything is open source and can be found on{' '}
                  <Link
                    to={'https://github.com/PorticoExchange'}
                    text={'our GitHub'}
                  />
                </p>
              )}
            />
            <Question
              title={style => (
                <h1 className={style}>What wallets are supported by Portico?</h1>
              )}
              content={style => (
                <p className={style}>
                  All regular and Lightning wallets are supported. Although we
                  encourage you to run a full node and manage your own keys,
                  there are custodial wallets solutions, like{' '}
                  <Link to={'https://bluewallet.io/'} text={'BlueWallet'} /> or{' '}
                  <Link
                    to={'https://walletofsatoshi.com'}
                    text={'Wallet of Satoshi'}
                  />
                  , that work out of the box and can make using Portico Exchange very
                  easy and too we support LNURL as Zebedee and Alby(porticoexchange@getalby.com)
                </p>
              )}
            />
            <Question
              title={style => (
                <h1 className={style}>
                  How to open Lightning channels with Portico Exchange?
                </h1>
              )}
              content={style => (
                <p className={style}>
                  We appreciate any channels you open with our Lightning nodes.
                  <NodeInfo
                    name={'BTC LND node'}
                    size={150}
                    uri={bitcoinLnd}
                    onionUri={bitcoinLndOnion}
                  />
                  {/* <NodeInfo
                    name={'LTC LND node'}
                    size={150}
                    uri={litecoinLnd}
                    onionUri={litecoinLndOnion}
                  /> */}
                </p>
              )}
            />
            <Question
              title={style => (
                <h1 className={style}>How are our fees calculated?</h1>
              )}
              content={style => (
                <p className={style}>
                  Our fees consist of the <i>miner fee</i> that is needed for
                  the onchain parts of the Submarine Swaps and an additional fee
                  which is a percentage of the traded amount and goes to our
                  pocket for providing a <i>(hopefully)</i> useful service to
                  our users.
                </p>
              )}
            />
            <Question
              title={style => <h1 className={style}>Acknowledgements</h1>}
              content={style => (
                <p className={style}>
                   Portico Exchange is a fork of <Link to={'https://boltz.exchange'} text={'Boltz'} />. 
                  We are a team of independent developers working to unite RSK, Liquid Network, Lightning Network, Layers third
                  and Bitcoin (On Chain) as Exchange Decentralized.
                </p>
              )}
            />
          </View>
        </View>
      </BackGround>
    );
  }
}

Faq.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Faq);
