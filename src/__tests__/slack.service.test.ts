import { BlockCollection, Blocks } from 'slack-block-builder';
import { createApp } from './fixtures';
import { SlackService } from '../slack.service';
import { ObjectChannel } from '../plugin';

describe('SlackService', () => {
  it('must be defined', async () => {
    const app = await createApp();
    expect(app.get<SlackService>(SlackService)).toBeDefined();
  });

  describe('helpers', () => {
    let service: SlackService;
    beforeEach(async () => {
      const app = await createApp();
      service = app.get<SlackService>(SlackService);
      service.postMessage = jest.fn();
    });
    describe('sendText', () => {
      it('must forward to sendMessage', async () => {
        await service.sendText('hello world');
        expect(service.postMessage).toHaveBeenCalledWith({
          text: 'hello world',
        });
      });
    });

    describe('sendBlocks', () => {
      it('must forward to sendMessage', async () => {
        const blocks = BlockCollection(Blocks.Section({ text: 'hello-world' }));
        await service.sendBlocks(blocks);
        expect(service.postMessage).toHaveBeenCalledWith({ blocks });
      });

      it('must forward to sendMessage with custom channel', async () => {
        const blocks = BlockCollection(Blocks.Section({ text: 'hello-world' }));
        const channel: ObjectChannel = {
          name: 'my-channel',
          url: 'https://hooks.slack.com/services/123456789/123456789/123456789',
        };
        await service.sendBlocks(blocks, {
          channel,
        });
        expect(service.postMessage).toHaveBeenCalledWith({
          blocks,
          channel: {
            name: 'my-channel',
            url: 'https://hooks.slack.com/services/123456789/123456789/123456789',
          },
        });
      });
    });

    describe('WebClient', () => {
      it('slack sdk WebClient is available', async () => {
        expect(service.client).toBeDefined();
      });
    });
  });
});
