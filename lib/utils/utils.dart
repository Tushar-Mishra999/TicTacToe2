import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:tic_tac_toe/resources/game_methods.dart';

void showSnackBar(BuildContext context, String content) {
  Fluttertoast.showToast(msg: content,backgroundColor:const Color(0xff01245D));
}

void showGameDialog(BuildContext context, String text) {
  showDialog(
      barrierDismissible: false,
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(text),
          actions: [
            TextButton(
              onPressed: () {
                GameMethods().clearBoard(context);
                Navigator.pop(context);
              },
              child: const Text(
                'Play Again',
              ),
            ),
          ],
        );
      });
}
