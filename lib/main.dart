import 'package:flutter/material.dart';
import 'package:tic_tac_toe/provider/room_data_provider.dart';
import 'package:tic_tac_toe/screens/create_room_screen.dart';
import 'package:tic_tac_toe/screens/game_screen.dart';
import 'package:tic_tac_toe/screens/join_room_screen.dart';
import 'package:tic_tac_toe/screens/main_menu_screen.dart';
import 'package:tic_tac_toe/utils/colors.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MultiProvider(
     providers:[
      ChangeNotifierProvider(create: (context)=>RoomDataProvider()),
    ],
    child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Tic Tac Toe',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: bgColor,
      ),
      routes: {
        MainMenuScreen.routeName: (context) =>  MainMenuScreen(),
        JoinRoomScreen.routeName: (context) =>  JoinRoomScreen(),
        CreateRoomScreen.routeName: (context) =>  CreateRoomScreen(),
        GameScreen.routeName: (context) =>  GameScreen(),
      },
      initialRoute: MainMenuScreen.routeName,
    );
  }
}
