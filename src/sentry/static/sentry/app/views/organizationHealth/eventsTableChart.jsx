import {Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import InlineSvg from 'app/components/inlineSvg';
import TableChart from 'app/components/charts/tableChart';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import space from 'app/styles/space';

const Delta = ({current, previous, className}) => {
  const changePercent = Math.round(Math.abs(current - previous) / (current + previous));
  const direction = !changePercent ? 0 : current - previous;

  return (
    <div className={className}>
      {!!direction && <DeltaCaret direction={direction} src="icon-caret" />}
      {changePercent}%
    </div>
  );
};
Delta.propTypes = {
  current: PropTypes.number,
  previous: PropTypes.number,
};

const DeltaCaret = styled(InlineSvg)`
  ${p => p.direction > 0 && `transform: rotate(180deg)`};
`;

const StyledDelta = styled(Delta)`
  border: 1px solid ${p => p.theme.borderLight};
`;

class EventsTableChart extends React.Component {
  static propTypes = {
    headers: PropTypes.arrayOf(PropTypes.node),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        percentage: PropTypes.number,
        count: PropTypes.number,
        lastCount: PropTypes.number,
      })
    ),
  };

  getDifference(count, lastCount) {}

  render() {
    const {headers, data} = this.props;

    return (
      <TableChart
        headers={headers}
        data={data.map(({count, lastCount, name, percentage}) => [
          <Name key="name">{name}</Name>,
          <Events key="events">
            {count}
            <StyledDelta current={count} previous={lastCount} />
          </Events>,
          <React.Fragment key="bar">
            <BarWrapper>
              <Bar width={percentage} />
            </BarWrapper>
            <span>{percentage}%</span>
          </React.Fragment>,
          <LastEvent key="time-ago">5 minutes ago</LastEvent>,
        ])}
        renderRow={({items}) => (
          <React.Fragment>
            <Flex
              flex={1}
              style={{flexShrink: 0, marginRight: 18}}
              justify="space-between"
              align="center"
            >
              <div>{items[0]}</div>
              <div>{items[1]}</div>
            </Flex>
            <Flex flex={3} justify="space-between" align="center">
              <Flex w={[3 / 4]} align="center" key="bar">
                {items[2]}
              </Flex>
              <Flex w={[1 / 4]} justify="flex-end" key="last-event">
                {items[3]}
              </Flex>
            </Flex>
          </React.Fragment>
        )}
      />
    );
  }
}

const StyledEventsTableChart = styled(EventsTableChart)`
  width: 100%;
`;

const BarWrapper = styled('div')`
  width: 85%;
  margin-right: ${space(1)};
`;

const Bar = styled(({width, ...props}) => <div {...props} />)`
  flex: 1;
  width: ${p => p.width}%;
  background-color: ${p => p.theme.gray1};
  height: 12px;
  border-radius: 2px;
`;

const Name = styled('span')`
  ${overflowEllipsis};
`;

const Events = styled(Name)`
  margin-left: ${space(0.5)};
`;

const LastEvent = styled(Name)`
  text-align: right;
  margin-left: ${space(0.5)};
`;

export default StyledEventsTableChart;
