from flask import Blueprint, request, jsonify
from services.mlb_service import get_live_game_data
from services.video_analyze_service import get_video_game_data
from flask_cors import cross_origin

mlb_blueprint = Blueprint('mlb', __name__)

@mlb_blueprint.route('/live', methods=['POST'])
@cross_origin(origins='*')  # 允许所有源访问
def fetch_live_data():
    """
    处理 MLB解说请求
    """
    try:
        data = request.json
        game_id = data.get('game_id',"")
        
        if not game_id:
            return jsonify({"error": "game_pk cannot be empty"}), 400
        
        response = get_live_game_data(game_id)
        return jsonify({"reply":response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@mlb_blueprint.route('/video', methods=['POST'])
@cross_origin(origins='*')  # 允许所有源访问
def fetch_video_data():
    """
    处理 MLB解说请求
    """
    try:
        data = request.json
        game_id = data.get('game_id',"")
        index = data.get('index',"")
        
        if not game_id:
            return jsonify({"error": "game_pk cannot be empty"}), 400
        if index == "":
            return jsonify({"error": "index cannot be empty"}), 400
        
        response = get_video_game_data(game_id,index) 
        return jsonify({"reply":response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500