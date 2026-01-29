import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service"; // Ajuste o caminho conforme sua pasta
import { CreateUserDto } from "src/users/dto/create-user.dto"; // Ajuste o caminho
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  // Rota: POST /auth/login
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Rota: POST /auth/register
  // Mudei de @Post() para @Post('register') para ficar mais semântico
  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Rota: GET /auth/user/:id
  // Alterei para não conflitar com rotas futuras e ficar claro que busca um user
  @Get("user/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
