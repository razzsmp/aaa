import './message.scoped.css';
import './message.global.css';

import moment from 'moment';
import { useSelector } from 'react-redux';
import { getChannelMessages } from '../../../store/messages';
import { getUser } from '../../../store/users';
import MessageToolbar from './message-toolbar';
import { ContextMenuTrigger } from 'react-contextmenu';
import MessageMenu from '../../ctx-menus/message-menu';
import classNames from 'classnames';
import Image from '../../utils/image';
import MessageContent from './message-content';
import MessageHeader from './message-header';

export interface MessageProps {
  message: Entity.Message;
}

const Message: React.FunctionComponent<MessageProps> = ({ message }: MessageProps) => {
  const author = useSelector(getUser(message.authorId));
  const messages = useSelector(getChannelMessages(message.channelId));
  const createdAt = new Date(message.createdAt);

  const isExtra = () => {
    const i = messages.findIndex(m => m.id === message.id);
    const prev = messages[i - 1];
    if (!prev) return false;

    const minsSince = moment(createdAt).diff(prev.createdAt, 'minutes');    
    const minsToSeparate = 5;

    return minsSince <= minsToSeparate
        && prev.authorId === message.authorId;
  }
  const isActuallyExtra = isExtra();

  const leftSide = () => (isActuallyExtra)
    ? <span className="timestamp text-xs select-none">
        {moment(createdAt).format('HH:mm')}
      </span>
    : <Image
        className="rounded-full cursor-pointer w-10 h-10"
        src={`${process.env.REACT_APP_CDN_URL}${author.avatarURL}`}
        onError={e => e.currentTarget.src = `${process.env.REACT_APP_CDN_URL}/avatars/unknown.png`}
        alt={author.username} />;

  return (
    <ContextMenuTrigger key={message.id} id={message.id}>
      <div className={classNames('message flex', { 'mt-4': !isActuallyExtra })}>
        <div className="flex-shrink-0 left-side text-xs w-16 mr-2 pl-5 pt-1">{leftSide()}</div>
        <div className="relative flex-grow px-2">
          <div className="absolute toolbar right-0 -mt-3 z-10">
            <MessageToolbar message={message} />
          </div>
          <MessageHeader
            author={author}
            message={message}
            isExtra={isActuallyExtra} />
          <MessageContent message={message} />
          {/* <MessageEmbed embed={{
            title: 'Never Gonna Give You Up',
            description: 'Never going to let you down',
            imageURL: 'https://discord.club/img/preview.480aa21a.png',
            url: 'https://discord.club/img/preview.480aa21a.png',
          }} /> */}
        </div>
        <div className="right-side w-12" />
      </div>
      <MessageMenu message={message} />
    </ContextMenuTrigger>
  );
}

export default Message;