### code to 
services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .AddAuthenticationSchemes("TallyIt_OR_Auth0")
                .Build();

                options.AddPolicy(TallyPolicies.ADMIN_ONLY, policy => policy.RequireClaim(TallyClaims.ROLES, TallyRoles.ORG_ADMIN));
            });

 services.AddAuthentication(options =>
            {
                options.DefaultScheme = "TallyIt";
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer("TallyIt", options => options.TokenValidationParameters = jwtService.TokenValidationParameters)
            .AddJwtBearer("Auth0", options =>
            {
                options.Authority = Configuration["Auth0:Domain"];
                options.Audience = Configuration["Auth0:Audience"];
            })
            .AddPolicyScheme("TallyIt_OR_Auth0", "TallyIt_OR_Auth0", options =>
            {
                options.ForwardDefaultSelector = context =>
                {
                    string authorization = context.Request.Headers[HeaderNames.Authorization];

                    if (!string.IsNullOrEmpty(authorization))
                    {
                        if (authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                        {
                            var token = authorization.Substring("Bearer ".Length).Trim();

                            var jwtHandler = new JwtSecurityTokenHandler();
                            if (jwtHandler.CanReadToken(token))
                            {
                                var jwtToken = jwtHandler.ReadJwtToken(token);

                                if (jwtToken.Issuer.Equals(Configuration["Auth0:Domain"]))
                                {
                                    return "Auth0";
                                }
                            }
                        }
                    }

                    return "TallyIt";
                };
            });
