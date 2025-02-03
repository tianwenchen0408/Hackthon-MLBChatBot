from config import GOOGLE_AI_API_KEY
import requests


class PlayStateTracker:
    def __init__(self):
        self.previous_pitch_index = []
        self.previous_action_index = []
        
    def get_new_events(self, current_play):
        """比较并获取新事件"""
        current_pitch_index = current_play.get('pitchIndex', [])
        current_action_index = current_play.get('actionIndex', [])
        
        # 获取新的事件索引
        new_pitch_indices = [idx for idx in current_pitch_index if idx not in self.previous_pitch_index]
        new_action_indices = [idx for idx in current_action_index if idx not in self.previous_action_index]
        
        # 更新存储的索引
        self.previous_pitch_index = current_pitch_index
        self.previous_action_index = current_action_index
        
        return new_pitch_indices, new_action_indices

def get_current_play_info(game_id, timestamp,state_tracker):
    url = f"https://statsapi.mlb.com/api/v1.1/game/{game_id}/feed/live?timecode={timestamp}"
    #url = f"https://statsapi.mlb.com/api/v1.1/game/716463/feed/live"

    try:
        response = requests.get(url)
        data = response.json()
        current_play = data['liveData']['plays']['currentPlay']
        
        # 获取新事件的索引
        new_pitch_indices, new_action_indices = state_tracker.get_new_events(current_play)
        
        # 构建基本play_info
        play_info = {
            'result': {
                'type': current_play['result'].get('type'),          
                'event': current_play['result'].get('event'),        
                'eventType': current_play['result'].get('eventType'),
                'description': current_play['result'].get('description'),
                'rbi': current_play['result'].get('rbi'),           
                'awayScore': current_play['result'].get('awayScore'),
                'homeScore': current_play['result'].get('homeScore'),
                'isOut': current_play['result'].get('isOut'),       
            },
            'count': {
                'balls': current_play['count'].get('balls'),
                'strikes': current_play['count'].get('strikes'),
                'outs': current_play['count'].get('outs'),
            },
            'runners': [{
                'movement': {
                    'originBase': runner['movement'].get('originBase'),
                    'start': runner['movement'].get('start'),
                    'end': runner['movement'].get('end'),
                    'outBase': runner['movement'].get('outBase'),
                    'isOut': runner['movement'].get('isOut'),
                    'outNumber': runner['movement'].get('outNumber')
                },
                'details': {
                    'event': runner['details'].get('event'),
                    'eventType': runner['details'].get('eventType'),
                    'movementReason': runner['details'].get('movementReason'),
                    'runner': {
                        'id': runner['details'].get('runner', {}).get('id'),
                        'fullName': runner['details'].get('runner', {}).get('fullName'),
                        'link': runner['details'].get('runner', {}).get('link')
                    },
                    'responsiblePitcher': runner['details'].get('responsiblePitcher'),
                    'isScoringEvent': runner['details'].get('isScoringEvent'),
                    'rbi': runner['details'].get('rbi'),
                    'earned': runner['details'].get('earned'),
                    'teamUnearned': runner['details'].get('teamUnearned'),
                    'playIndex': runner['details'].get('playIndex')
                },
                'credits': [{
                    'player': {
                        'id': credit.get('player', {}).get('id'),
                        'link': credit.get('player', {}).get('link')
                    },
                    'position': {
                        'code': credit.get('position', {}).get('code'),
                        'name': credit.get('position', {}).get('name'),
                        'type': credit.get('position', {}).get('type'),
                        'abbreviation': credit.get('position', {}).get('abbreviation')
                    },
                    'credit': credit.get('credit')
                } for credit in runner.get('credits', [])]
            } for runner in current_play.get('runners', [])],
            'pitchIndex': current_play.get('pitchIndex', []),
            'actionIndex': current_play.get('actionIndex', [])
        }
        
        # 添加新的字段表示新事件
        play_info['new_events'] = {
            'new_pitch_indices': new_pitch_indices,
            'new_action_indices': new_action_indices
        }
        
        return play_info
        
    except Exception as e:
        print(f"Error: {e}")
        return None



