import { Injectable } from '@angular/core';
import { HttpClient,
         HttpHeaders,
         HttpErrorResponse } from '@angular/common/http';
import { throwError,
         Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryOutput } from '@aws-sdk/client-dynamodb';
import { InvocationResponse } from '@aws-sdk/client-lambda';
import * as _ from 'lodash';
import { CanonicalPassthroughRoutes,
         CanonicalPassthroughErrors,
         CanonicalDLIInstructions } from '@adonoustech/desoscript-extras';
import { ICognitoIdTokenPayload, IDataLayerInterceptorRequest, 
         ILogMetricFilter, 
         IObjectLayerInterceptorRequest, 
         IOTPermsBrokerRequest, 
         IQueueLayerInterceptorRequest, 
         IStateMachineInvocationRequest, 
         SystemMessages} from '@adonoustech/desoscript-aws';
import { IDesoLayerExchangeRateRequest, 
         IDesoLayerInterceptorRequest } from '@adonoustech/desoscript-core';
import { environment } from '../../../environments/environment';
import { SharedAuthService } from '../services/auth/shared-auth.service';


@Injectable({
  providedIn: 'root'
})
export class PassthroughService {

  baseUri: string = environment.api.UIPassthroughUri;
  pubBaseUri: string = environment.api.PubUIPassthroughUri;

  constructor(private http: HttpClient ) { }

  passthrough(payload: any, route: string, 
                       instruction?: string, key?: string, isPublic?:boolean): Promise<any> {

    return new Promise(async (resolve, reject) => {

      // is the request public
      if (isPublic) {

        this.postPubCloutRequest(<IDesoLayerInterceptorRequest> payload)
        .subscribe(
          {
            next: ((response: InvocationResponse) => {
                // If InvocationResponse contains function error, short circuit
                // and reject with error. However do not throw for certain errors such
                // as conditional checks
                if (response.FunctionError) {
                  reject(response.Payload);
                };
                
                resolve(response.Payload);
            }),
            error: (async (error: string) => {
              // provide context to log with the returned error string
              try {
                if (!(payload.bypassLogger)) {
                  await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                }
                reject(SystemMessages.GenericOperationError);
              } catch (error) {
                // log to console as last resort, then return friendly message to caller
                console.log(error);
                reject(SystemMessages.GenericOperationError);
              }})});

      } else {

        try {
          const token: string = await SharedAuthService.getIdTokenPromise();
          
            // evaluate the route and call the appropriate endpoint
            switch (route) {
              case CanonicalPassthroughRoutes.CLOUT:
                this.postCloutRequest(token, <IDesoLayerInterceptorRequest> payload)
                    .subscribe(
                      {
                        next: ((response: InvocationResponse) => {
                            // If InvocationResponse contains function error, short circuit
                            // and reject with error. However do not throw for certain errors such
                            // as conditional checks
                            if (response.FunctionError) {
                              reject(response.Payload);
                            };
                            
                            resolve(response.Payload);
                        }),
                        error: (async (error: string) => {
                          // provide context to log with the returned error string
                          try {
                            if (!(payload.bypassLogger)) {
                              await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                            }
                            reject(SystemMessages.GenericOperationError);
                          } catch (error) {
                            // log to console as last resort, then return friendly message to caller
                            console.log(error);
                            reject(SystemMessages.GenericOperationError);
                          }})});
                  break;
              case CanonicalPassthroughRoutes.DATAREQUEST:
                  this.postData(token, <IDataLayerInterceptorRequest> payload)
                      .subscribe(
                        { next: ((response: InvocationResponse) => {
                          // If InvocationResponse contains function error, short circuit
                          // and reject with error. However do not throw for certain errors such
                          // as conditional checks
                          if (response.FunctionError) {
                            // Do not reject for ConditionalCheckFailures
                            const qualifiedErrorPayload: any = response.Payload; // this is a string
                            const parsedErrorPayload: any = JSON.parse(qualifiedErrorPayload);
                            if (!(parsedErrorPayload['errorType'] === CanonicalPassthroughErrors.CONDITIONALCHECKFAILEDEXCEPTION)) {
                              reject(response.Payload); // response.Payload is detailed error result
                            } else {
                              // Nothing else to do on conditional checks, resolve with empty
                              // object
                              resolve({});
                            }
                          }
    
                          // Process payload from Lambda response
                          const qualifiedPayload: QueryOutput = response.Payload as QueryOutput;
    
                          if (instruction) {
                            if (instruction === CanonicalDLIInstructions.QUERY) {
                              // DDB Query returns array of Items. Next access the object at the appropriate
                              // key in the db.
                              //**NOTE: For DDB basic NON-RECURSIVE queries, key must be passed in as a parameter to PASSTHROUGH method.
                              const queriedObject = qualifiedPayload.Items ?  qualifiedPayload.Items[0][<string>key] : null;
                              resolve(queriedObject);
                            }
    
                            if (instruction === CanonicalDLIInstructions.QUERY_RECURSIVE_ITEM_SET) {
                              // Recursive item set queries return an array of qualified objects
                              // from the DLI. These queries do not require a specific object key
                              // because it is resolved in the DLI. 
                              resolve(qualifiedPayload);
                            }
                          }
    
                          // For all other DLI instructions, simply return the qualifiedPayload parsed (response.Payload)
                          resolve(qualifiedPayload);
                        }),
                        error: (async (error: string) => {
                          // provide context to log with the returned error string
                          try {
                            await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                            reject(SystemMessages.GenericOperationError);
                          } catch (error) {
                            // log to console as last resort, then return friendly message to caller
                            console.log(error);
                            reject(SystemMessages.GenericOperationError);
                          }
                        })});
                    break;
              case CanonicalPassthroughRoutes.STORAGEREQUEST:
                this.postStorageObject(token, <IObjectLayerInterceptorRequest> payload)
                    .subscribe(
                      { next: ((response: InvocationResponse) => {
                        resolve(response);
                      }),
                      error: (async (error: string) => {
                        // provide context to log with the returned error string
                        try {
                          if (!(payload.bypassLogger)) {
                            await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                          }
                          reject(SystemMessages.GenericOperationError);
                        } catch (error) {
                          // log to console as last resort, then return friendly message to caller
                          console.log(error);
                          reject(SystemMessages.GenericOperationError);
                        }
                      })});
                  break;
              case CanonicalPassthroughRoutes.LOGREQUEST:
                this.postLogger(token, <ILogMetricFilter> payload)
                    .subscribe(
                      { next: ((response: InvocationResponse) => {
                        resolve(response);
                      }),
                      error: ((error: any) => {
                        // generically reject promise for any logger errors
                        reject(error);
                      })});
                break;
              case CanonicalPassthroughRoutes.QUEUEREQUEST:
                    this.postQueueRequest(token, <IQueueLayerInterceptorRequest> payload)
                        .subscribe(
                          {
                            next: ((response: InvocationResponse) => {
                              resolve(response);
                            }),
                            error: (async (error: string) => {
                              // provide context to log with the returned error string
                              try {
                                if (!(payload.bypassLogger)) {
                                  await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                                }
                                reject(SystemMessages.GenericOperationError);
                              } catch (error) {
                                // log to console as last resort, then return friendly message to caller
                                console.log(error);
                                reject(SystemMessages.GenericOperationError);
                              }})});
                      break;
              case CanonicalPassthroughRoutes.IOTPERMS:
                  this.postIOTPermsRequest(token, <IOTPermsBrokerRequest> payload)
                      .subscribe(
                        {
                          next: ((response: InvocationResponse) => {
                            resolve(response);
                          }),
                          error: (async (error: string) => {
                            // provide context to log with the returned error string
                            try {
                              if (!(payload.bypassLogger)) {
                                await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                              }
                              reject(SystemMessages.GenericOperationError);
                            } catch (error) {
                              // log to console as last resort, then return friendly message to caller
                              console.log(error);
                              reject(SystemMessages.GenericOperationError);
                            }})});
                          break;    
              case CanonicalPassthroughRoutes.STEPINVOKE:
                  this.postStepInvokeRequest(token, <IStateMachineInvocationRequest> payload)
                      .subscribe(
                        {
                          next: ((response: InvocationResponse) => {
                            resolve(response);
                          }),
                          error: (async (error: string) => {
                            // provide context to log with the returned error string
                            try {
                              if (!(payload.bypassLogger)) {
                                await this.logMetricErrorWithService(SystemMessages.GenericOperationError, error);
                              }
                              reject(SystemMessages.GenericOperationError);
                            } catch (error) {
                              // log to console as last resort, then return friendly message to caller
                              console.log(error);
                              reject(SystemMessages.GenericOperationError);
                            }})});
                          break;              
                default:
                    try {
                      await this.logMetricErrorWithService(SystemMessages.UnknownBLIRoute, '');
                      reject(SystemMessages.GenericOperationError);
                    } catch (error) {
                      // log to console as last resort, then return friendly message to caller
                      console.log(error);
                      reject(SystemMessages.GenericOperationError);
                    }
                  break;                       
            }
          } catch (error) {
            reject(error);
          }

      }

  });
}

private postCloutRequest(token: string, payload: IDesoLayerInterceptorRequest) {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.CLOUT, payload, httpOptions)
  .pipe(catchError(this.handleError));
}

private postPubCloutRequest(payload: IDesoLayerInterceptorRequest) {
  const httpOptions = this.constructPubOptions();
  return this.http
  .post(this.pubBaseUri + CanonicalPassthroughRoutes.CLOUT, payload, httpOptions)
  .pipe(catchError(this.handleError));
}

private postData(token: string, payload: IDataLayerInterceptorRequest): Observable<InvocationResponse> {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.DATAREQUEST, payload, httpOptions)
  .pipe(catchError(this.handleError));    
}

private postStorageObject(token: string, payload: IObjectLayerInterceptorRequest): Observable<InvocationResponse> {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.STORAGEREQUEST, payload, httpOptions)
  .pipe(catchError(this.handleError));
}

private postLogger(token: string, payload: ILogMetricFilter ): Observable<InvocationResponse> {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.LOGREQUEST, payload, httpOptions)
  .pipe(catchError(this.handleError));
}


private postQueueRequest(token: string, payload: IQueueLayerInterceptorRequest) {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.QUEUEREQUEST, payload, httpOptions)
  .pipe(catchError(this.handleError));
}

private postIOTPermsRequest(token: string, payload: IOTPermsBrokerRequest) {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.IOTPERMS, payload, httpOptions)
  .pipe(catchError(this.handleError));
}

private postStepInvokeRequest(token: string, payload: IStateMachineInvocationRequest) {
  const httpOptions = this.constructOptions(token);
  return this.http
  .post(this.baseUri + CanonicalPassthroughRoutes.STEPINVOKE, payload, httpOptions)
  .pipe(catchError(this.handleError));
}

private constructOptions(token: string) {
  const options = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': token
    })
  };
  return options;
}

private constructPubOptions() {
  const options = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    })
  };
  return options;
}

  /**
   * Evaluate the error. Determine the error type and return the error to the
   * caller. The caller will take the error message and call the passthrough /log endpoint.
   * Note the caller is the contained Passthrough method.
   * Angular advises Error inspection, interpretation, 
   * and resolution is something you want to do in the service, not in the component.
   * See https://angular.io/guide/http#getting-error-details
   * @private
   * @param {HttpErrorResponse} error
   * @returns
   * @memberof PassthroughSerive
   */
   private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.log(error);
      return throwError(error.error.message);
    } else {
      console.log(error);
      return throwError(error.message);
    }
  }
   
logMetricErrorWithService(canonicalMessage: any, errorMessage: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const user: ICognitoIdTokenPayload = await SharedAuthService.getUserForLoggingAndTrace();
      const metricFilter: ILogMetricFilter = {
        eventType: 'CriticalError',
        code: 'SPA Business Layer Passthrough Service',
        componenet: 'bl-passthrough-service',
        description: canonicalMessage,
        explanation: errorMessage,
        user: user
      };
      await this.passthrough(metricFilter, CanonicalPassthroughRoutes.LOGREQUEST);
      resolve();
    } catch (error) {
      // Fatal error if we cannot send details to logger service
      // log to the console as a last resort
      console.log('[FATAL] - Failed to privately log error.');
      console.log(error);
      reject(error);
    }
  });
}



}
