import { describe, expect, it } from '@jest/globals';

import { createTradeAck, createTradeAckV2, decodeTradeAck, encodeTradeAck } from './ackCodec';

describe('trade ack codec', () => {
  it('round-trips v1 encode → decode', () => {
    const ack = createTradeAck('offer-123', new Date('2026-05-21T14:00:00Z'));
    const encoded = encodeTradeAck(ack);
    expect(decodeTradeAck(encoded)).toEqual(ack);
  });

  it('round-trips v2 encode → decode', () => {
    const ack = createTradeAckV2('offer-456', ['album:2', 'album:4']);
    const encoded = encodeTradeAck(ack);
    expect(decodeTradeAck(encoded)).toEqual(ack);
  });

  it('rejects invalid version', () => {
    const bad = { ...createTradeAck('x'), v: 99 };
    const encoded = encodeTradeAck(bad as never);
    expect(() => decodeTradeAck(encoded)).toThrow('INVALID_ACK_VERSION');
  });
});
