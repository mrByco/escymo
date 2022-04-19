FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["mc_host/mc_host.csproj", "mc_host/"]
RUN dotnet restore "mc_host/mc_host.csproj"
COPY . .
WORKDIR "/src/mc_host"
RUN dotnet build "mc_host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "mc_host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "mc_host.dll"]
