FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["web_client/web_client.csproj", "web_client/"]
RUN dotnet restore "web_client/web_client.csproj"
COPY . .
WORKDIR "/src/web_client"
RUN dotnet build "web_client.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "web_client.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "web_client.dll"]
