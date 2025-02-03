from flask import Blueprint, request, jsonify
from services.ai_service import get_gemini_response
from services.warm_up_service import get_warm_up_response
from flask_cors import cross_origin

ai_blueprint = Blueprint('ai', __name__)

@ai_blueprint.route('/chat', methods=['POST'])
@cross_origin(origins='*')  # 允许所有源访问
def chat():
    """
    处理 AI 聊天请求
    """
    try:
        data = request.json
        user_input = data.get('message', '')
        user_uuid = data.get('id', None)  # Get the UUID from the JSON if provided
        game_pk = data.get('game_pk',"")
    
        if not user_input:
            return jsonify({"error": "Message cannot be empty"}), 400
        if not user_uuid:
            return jsonify({"error": "id cannot be empty"}), 400
        if not game_pk:
            return jsonify({"error": "game_pk cannot be empty"}), 400

        # response = get_gemini_response(user_input)
        response = get_gemini_response(user_input,game_pk,user_uuid)
        return jsonify({"reply": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ai_blueprint.route('/warmup', methods=['POST'])
@cross_origin(origins='*')  # 允许所有源访问
def warmup():
    """
    处理 warmup 请求
    """
    try:
        data = request.json
        game_pk = data.get('game_pk',"")
        
        response = get_warm_up_response(game_pk)
        print(response)
        return jsonify({"reply": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500