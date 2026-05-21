import { describe, expect, it } from '@jest/globals';

import { createTradeAck, decodeTradeAck, encodeTradeAck } from './ackCodec';

describe('trade ack codec', () => {
  it('round-trips encode → decode', () => {
    const ack = createTradeAck('offer-123', new Date('2026-05-21T14:00:00Z'));
    const encoded = encodeTradeAck(ack);
    expect(decodeTradeAck(encoded)).toEqual(ack);
  });

  it('rejects invalid version', () => {
    const bad = { ...createTradeAck('x'), v: 99 };
    const encoded = encodeTradeAck(bad as never);
    expect(() => decodeTradeAck(encoded)).toThrow('INVALID_ACK_VERSION');
  });
});
